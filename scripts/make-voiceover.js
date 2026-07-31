const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

async function downloadTTS(text, filename) {
  console.log(`Downloading TTS for: "${text.substring(0, 30)}..."`);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch TTS for text. Status: ${res.status}`);
  }
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(buffer));
}

async function run() {
  console.log('Using FFmpeg path:', ffmpegPath);
  if (!ffmpegPath) {
    throw new Error('ffmpeg-static binary not found!');
  }

  const tmpDir = path.join(__dirname, '../tmp/audio');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  // Texts for narration
  const segments = [
    "Chào mừng bạn đến với RinoEdu. Sau đây là hướng dẫn đăng nhập hệ thống.",
    "Đầu tiên, bạn có thể chọn ngôn ngữ hiển thị là tiếng Việt hoặc tiếng Anh chỉ với một cú click chuột.",
    "Tiếp theo, hãy điền địa chỉ email và mật khẩu của bạn vào ô đăng nhập.",
    "Bạn có thể nhấn vào biểu tượng con mắt ở góc phải để kiểm tra lại mật khẩu trước khi gửi.",
    "Cuối cùng, hãy nhấn nút Đăng nhập. Hệ thống sẽ xác thực và tự động đưa bạn đến giao diện lịch học."
  ];

  console.log('Step 1: Generating silent audio...');
  const silenceFile = path.join(tmpDir, 'silence.mp3');
  // Generate 0.7 seconds of silence
  execSync(`"${ffmpegPath}" -y -f lavfi -i anullsrc=r=24000:cl=mono -t 0.7 "${silenceFile}"`, { stdio: 'inherit' });

  console.log('Step 2: Downloading voiceover segments...');
  const filesList = [];
  for (let i = 0; i < segments.length; i++) {
    const rawSegFile = path.join(tmpDir, `raw_seg_${i}.mp3`);
    const segFile = path.join(tmpDir, `seg_${i}.mp3`);
    await downloadTTS(segments[i], rawSegFile);
    
    // Speed up segment by 20%
    console.log(`Speeding up segment ${i} by 1.2x...`);
    execSync(`"${ffmpegPath}" -y -i "${rawSegFile}" -filter:a "atempo=1.20" "${segFile}"`, { stdio: 'ignore' });
    try {
      fs.unlinkSync(rawSegFile);
    } catch (e) {}
    
    // Add segment to list
    filesList.push(segFile);
    // Add silence after segment (except the last one)
    if (i < segments.length - 1) {
      filesList.push(silenceFile);
    }
  }

  console.log('Step 3: Creating concatenation file list...');
  const listFile = path.join(tmpDir, 'list.txt');
  // Format must use forward slashes or escaped backslashes for ffmpeg concat demuxer
  const listContent = filesList.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(listFile, listContent);

  console.log('Step 4: Concatenating audio segments...');
  const finalAudio = path.join(tmpDir, 'voice_full.mp3');
  execSync(`"${ffmpegPath}" -y -f concat -safe 0 -i "${listFile}" -c copy "${finalAudio}"`, { stdio: 'inherit' });

  // Locate the input webm video file.
  // In the previous task, we copied it to the workspace root directory. Let's find it.
  const inputVideo = path.join(__dirname, '../login_tutorial.webm');
  if (!fs.existsSync(inputVideo)) {
    throw new Error(`Input video not found at: ${inputVideo}`);
  }

  console.log('Step 5: Merging video and audio to produce a high-compatibility H.264 MP4 file...');
  const outputMp4 = path.join(__dirname, '../login_tutorial_voiceover.mp4');
  
  // Combine video and audio:
  // -c:v libx264 -pix_fmt yuv420p encodes to high-compatibility H.264 MP4 video
  // -c:a aac -b:a 128k encodes to high-compatibility AAC audio
  execSync(`"${ffmpegPath}" -y -i "${inputVideo}" -i "${finalAudio}" -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 "${outputMp4}"`, { stdio: 'inherit' });

  console.log('Success! Final video with voiceover saved to:', outputMp4);
  
  // Also copy to artifacts directory
  const destDir = 'C:\\Users\\Jacky Tran\\.gemini\\antigravity\\brain\\24e51d81-950b-41e0-a755-48e8fc73dad4';
  if (fs.existsSync(destDir)) {
    const destMp4 = path.join(destDir, 'login_tutorial_voiceover.mp4');
    fs.copyFileSync(outputMp4, destMp4);
    console.log('Copied to artifacts folder:', destMp4);
  }

  // Clean up temp files
  try {
    fs.unlinkSync(listFile);
    fs.unlinkSync(silenceFile);
    for (let i = 0; i < segments.length; i++) {
      fs.unlinkSync(path.join(tmpDir, `seg_${i}.mp3`));
    }
    fs.unlinkSync(finalAudio);
    fs.rmdirSync(tmpDir);
    console.log('Cleaned up temporary audio files.');
  } catch (e) {
    console.log('Error cleaning up:', e.message);
  }
}

run().catch(err => {
  console.error('Error making voiceover:', err);
  process.exit(1);
});
