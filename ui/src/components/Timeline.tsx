import type { ModeInfo } from '@/app/page';
import styles from './Timeline.module.css'
import { Tooltip } from 'react-tooltip'
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
  console.info({ size, current, last, duration })
  return (
    <Tooltip content="Test">
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

export default function Timeline(
  { modes, time, duration, colors }:
  {
    modes: Record<string, ModeInfo>
    time: number
    duration: number
    colors: Record<string, string>
  }
) {
  let times = Object.keys(modes).sort()
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

  times = Object.keys(modes).sort()

  const spans: Array<ReactElement> = []
  times.forEach((id, idx) => {
    const current = modes[id]
    if(idx > 0) {
      spans.push(
        <Block
          key={idx}
          {...{ current, last, duration }}
          bg={colors[current.mode]}
        />
      )
    }
    last = current
  })

  return (
    <div className={styles.colorbar}>{spans}</div>
  )
}