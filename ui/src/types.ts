export type Maybe<T> = T | null

export type ButtonInfo = {
  bg: string
  icon: string
  label: string
  href?: string
}

export type TrackedRightness = (
  'on-topic-correct'
  | 'on-topic-incorrect'
  | 'off-topic-correct'
  | 'off-topic-incorrect'
)

export type ModeInfo = {
  id?: string
  mode?: string
  start: number
  orientation?: TrackedRightness
}

export type EventInfo = {
  id?: string
  event?: string
  at: number
  explanation?: string
}

export type Metadata = {
  video?: string
  buttons: {
    mode?: Array<ButtonInfo>
    event?: Array<ButtonInfo>
    action?: Array<ButtonInfo>
  },
  modes: Array<ModeInfo>
  events: Array<EventInfo>
}

export type ConfigContextProps = {
  modeButtons: Array<ButtonInfo>
  setModeButtons: (buttons: Array<ButtonInfo>) => void
  eventButtons: Array<ButtonInfo>
  setEventButtons: (buttons: Array<ButtonInfo>) => void
  actionButtons: Array<ButtonInfo>
  setActionButtons: (buttons: Array<ButtonInfo>) => void
  videoSource?: string
  setVideoSource: (src?: string) => void
  modes: Array<ModeInfo>
  setModes: (ms: (prev: Array<ModeInfo>) => Array<ModeInfo>) => void
  events: Array<EventInfo>
  setEvents: (es: (prev: Array<EventInfo>) => Array<EventInfo>) => void
  duration?: number
  setDuration: (dur?: number) => void
  getConfig: () => Metadata
  setConfig: (cfg: Metadata) => void
  resetConfig: () => void
}