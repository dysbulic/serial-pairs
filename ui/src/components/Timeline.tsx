"use client"

import type { EventInfo, ModeInfo } from '@/types';
import styles from './Timeline.module.css'
import Tooltip from '@tippyjs/react'
import { ReactElement, useContext } from 'react'
import Markdown from 'react-markdown'
import remarkGFM from 'remark-gfm'
import { ConfigContext } from '@/contexts/ConfigurationContext';
import { s2Clock } from '@/utils';

export const Block = (
  { current, last, duration, bg, upsertMode }:
  { 
    current: ModeInfo
    last: ModeInfo
    duration: number
    bg: string
    upsertMode: (info: ModeInfo, delay: boolean) => void
  }
) => {
  const size = (
    (current.start - last.start) * 100 / duration
  )
  return (
    <Tooltip content={`${last.mode}: ${s2Clock(last.start)}–${s2Clock(current.start)}`}>
      <span
        className={styles.block}
        style={{
          '--size': `${size}%`,
          '--bg': bg,
        } as React.CSSProperties}
        onClick={() => upsertMode(last, true)}
      />
    </Tooltip>
  )
}

const timeSort = (a: ModeInfo, b: ModeInfo) => (
  a.start - b.start
)

export default function Timeline(
  {
    time, setTime, modeColors, eventIcons, upsertMode, upsertEvent,
  }:
  {
    time: number
    setTime: (time: number) => void
    modeColors: Record<string, string>
    eventIcons: Record<string, string>
    upsertMode: (info: ModeInfo, delay: boolean) => void
    upsertEvent: (info: EventInfo, delay: boolean) => void
  }
) {
  const { modes, events, duration } = useContext(ConfigContext)

  let sorted = modes.sort(timeSort)
  if(sorted.length === 0 || sorted[0].start !== 0) {
    modes.unshift({ mode: 'Unknown', start: 0 })
  }

  let last = sorted.at(-1)!
  if(last.start < time) {
    modes.push({ mode: 'Unknown', start: time })
  }

  const dur = duration ?? 0
  if(last.start < dur) {
    modes.push({ mode: 'Unknown', start: dur })
  }

  sorted = modes.sort(timeSort)
  console.debug({sorted})

  const spans: Array<ReactElement> = []
  sorted.forEach((current, idx) => {
    if(idx > 0 && !!last.mode) {
      spans.push(
        <Block
          key={idx}
          {...{ current, last, upsertMode }}
          duration={dur}
          bg={modeColors[last.mode]}
        />
      )
    }
    last = current
  })

  return (
    <section className={styles.colorbar}>
      {spans}
      {events.map((event, idx) => {
        const { at, event: type, explanation } = event
        let markdown = `## ${s2Clock(at)}: ${type}`
        if(!!explanation) {
          markdown = (
`${markdown}

${explanation}`
          )
        }
        return (
          type && (
            <Tooltip
              key={idx}
              content={
                <Markdown remarkPlugins={[remarkGFM]}>
                  {markdown}
                </Markdown>
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.event}
                src={eventIcons[type]}
                alt={type}
                style={{ '--pos': `${at * 100 / (duration ?? 1)}%` } as React.CSSProperties}
                onClick={() => upsertEvent(event, true)}
              />
            </Tooltip>
          )
        )
      })}
      <input
        type="range"
        min="0" max={duration}
        value={time}
        onChange={({ target: { value } }) => setTime(Number(value))}
      />
    </section>
  )
}