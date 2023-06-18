import type { EventInfo, ModeInfo } from '@/app/page';
import styles from './Timeline.module.css'
import Tooltip from '@tippyjs/react'
import { ReactElement } from 'react';

export const Block = (
  { current, last, duration, bg }:
  { 
    current: ModeInfo
    last: ModeInfo
    duration: number
    bg: string
  }
) => {
  const size = (
    (current.start - last.start) * 100 / duration
  )
  return (
    <Tooltip content={`${last.mode}: ${last.start}–${current.start}`}>
      <span
        className={styles.block}
        style={{
          '--size': `${size}%`,
          '--bg': bg,
        } as React.CSSProperties}
      />
    </Tooltip>
  )
}

const timeSort = (a: string, b: string) => (
  Number(a) - Number(b)
)

export default function Timeline(
  {
    modes: input, events, time, setTime,
    duration, modeColors, eventIcons,
  }:
  {
    modes: Record<string, ModeInfo>
    events: Array<EventInfo>
    time: number
    setTime: (time: number) => void
    duration: number
    modeColors: Record<string, string>
    eventIcons: Record<string, string>
  }
) {
  const modes = { ...input }

  let times = Object.keys(modes).sort(timeSort)
  if(times.length === 0 || times[0] !== '0') {
    modes['0'] = { mode: 'Unknown', start: 0 }
    times.unshift('0')
  }

  let last = modes[times.at(-1)!];
  if(last.start < time) {
    last = { mode: 'Unknown', start: time }
    modes[time] = last
  }

  if(last.start < duration) {
    last = { mode: 'Unknown', start: duration }
    modes[duration] = last
  }

  times = Object.keys(modes).sort(timeSort)

  const spans: Array<ReactElement> = []
  times.forEach((id, idx) => {
    const current = modes[id]
    if(idx > 0) {
      spans.push(
        <Block
          key={idx}
          {...{ current, last, duration }}
          bg={modeColors[last.mode]}
        />
      )
    }
    last = current
  })

  return (
    <section className={styles.colorbar}>
      {spans}
      {events.map(({ at, event }, idx) => (
        <Tooltip
          key={idx}
          content={`${at}: ${event}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.event}
            src={eventIcons[event]}
            alt={event}
            style={{ '--pos': `${at * 100 / duration}%` } as React.CSSProperties}
          />
        </Tooltip>
      ))}
      <input
        type="range"
        min="0" max={duration}
        value={time}
        onChange={({ target: { value } }) => setTime(Number(value))}
      />
    </section>
  )
}