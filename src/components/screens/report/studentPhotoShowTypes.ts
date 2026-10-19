export type TransitionEffect = 'ken-burns' | 'fade' | 'slide'
export type PlayOrder = 'chronological' | 'reverse' | 'shuffle'
export type PhotoDurationSeconds = 3 | 4 | 5 | 7

export interface LiveShowConfig {
  effect: TransitionEffect
  duration: PhotoDurationSeconds
  order: PlayOrder
  muted: boolean
}
