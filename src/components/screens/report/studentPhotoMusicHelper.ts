/**
 * Bộ phát nhạc nền du dương, nhẹ nhàng sử dụng Web Audio API.
 * Hoạt động 100% offline, không cần tải tệp âm thanh bên ngoài, không lo lỗi mạng hay CORS.
 * Tái tạo âm hưởng Celesta / Piano âm vang êm dịu, ấm áp với âm lượng rõ ràng.
 */
export class AmbientMusicPlayer {
  private ctx: AudioContext | null = null
  private isPlaying = false
  private timer: NodeJS.Timeout | null = null
  private masterGain: GainNode | null = null
  private volume = 0.38 // Giảm 50% theo phản hồi người dùng: êm dịu, ấm áp, thư thái

  // Chuỗi hợp âm du dương: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4 (êm dịu, ấm áp, đậm chất cảm xúc)
  private chordProgression = [
    {
      bass: 130.81, // C3
      notes: [261.63, 329.63, 392.0, 493.88, 587.33, 659.25], // C4, E4, G4, B4, D5, E5
    },
    {
      bass: 110.0, // A2
      notes: [220.0, 261.63, 329.63, 392.0, 493.88, 587.33], // A3, C4, E4, G4, B4, D5
    },
    {
      bass: 87.31, // F2
      notes: [174.61, 220.0, 261.63, 329.63, 392.0, 523.25], // F3, A3, C4, E4, G4, C5
    },
    {
      bass: 98.0, // G2
      notes: [196.0, 261.63, 293.66, 392.0, 440.0, 587.33], // G3, C4, D4, G4, A4, D5
    },
  ]
  private chordIndex = 0
  private noteStep = 0

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime)
        this.masterGain.connect(this.ctx.destination)
      }
    }
  }

  /**
   * Phát nốt đơn với âm sắc ấm, bồi âm hài hòa (Harmonics) và lọc tần số Biquad
   */
  private playTone(freq: number, duration = 1.6, isBass = false) {
    if (!this.ctx || !this.masterGain) return

    try {
      const now = this.ctx.currentTime

      // 1. Oscillator chính (Sine ấm cho nốt cao, Triangle cho nốt trầm)
      const osc1 = this.ctx.createOscillator()
      osc1.type = isBass ? 'triangle' : 'sine'
      osc1.frequency.setValueAtTime(freq, now)

      // 2. Oscillator bồi âm ngân nga (Chime Overtones)
      const osc2 = this.ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(freq * 2, now)

      // 3. Bộ lọc tần số thấp (Low-pass) để âm thanh ấm áp, không bị chói gắt
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(isBass ? 450 : 2800, now)

      // 4. Điều chỉnh Envelope độ lớn âm lượng (Attack & Decay) - Giảm 50% để dịu êm
      const noteGain = this.ctx.createGain()
      const peakGain = isBass ? 0.18 : 0.24

      noteGain.gain.setValueAtTime(0.001, now)
      noteGain.gain.exponentialRampToValueAtTime(peakGain, now + (isBass ? 0.12 : 0.05))
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      // Bồi âm ngân nhẹ
      const harmonicGain = this.ctx.createGain()
      harmonicGain.gain.setValueAtTime(isBass ? 0.04 : 0.09, now)

      osc1.connect(noteGain)
      osc2.connect(harmonicGain)
      harmonicGain.connect(noteGain)

      noteGain.connect(filter)
      filter.connect(this.masterGain)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + duration)
      osc2.stop(now + duration)
    } catch {
      // AudioContext interrupted
    }
  }

  public setVolume(level: number) {
    this.volume = Math.max(0, Math.min(1, level))
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime)
      } catch {
        // AudioContext not ready
      }
    }
  }

  public getVolume(): number {
    return this.volume
  }

  public start() {
    this.initContext()
    if (!this.ctx) return

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }

    this.isPlaying = true
    if (this.timer) clearInterval(this.timer)

    // Phát chuỗi giai điệu êm dịu cách nhau 780ms
    this.timer = setInterval(() => {
      if (!this.isPlaying) return

      const currentChord = this.chordProgression[this.chordIndex]

      // Nốt đầu hợp âm: đệm thêm nốt Bass trầm ấm
      if (this.noteStep === 0) {
        this.playTone(currentChord.bass, 2.4, true)
      }

      const note = currentChord.notes[this.noteStep % currentChord.notes.length]
      this.playTone(note, 1.6, false)

      this.noteStep++
      if (this.noteStep >= currentChord.notes.length) {
        this.noteStep = 0
        this.chordIndex = (this.chordIndex + 1) % this.chordProgression.length
      }
    }, 780)
  }

  public pause() {
    this.isPlaying = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  public resume() {
    if (!this.isPlaying) {
      this.start()
    }
  }

  public stop() {
    this.pause()
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {})
      this.ctx = null
      this.masterGain = null
    }
  }
}
