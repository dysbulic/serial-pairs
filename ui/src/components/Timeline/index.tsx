"use client"

import Tooltip from '@tippyjs/react'
import { ReactElement, useContext } from 'react'
import Markdown from 'react-markdown'
import remarkGFM from 'remark-gfm'
import type { EventInfo, ModeInfo } from '@/types';
import { ConfigContext } from '@/contexts/ConfigurationContext';
import { s2Clock, sspan2Clock } from '@/utils';
import styles from './index.module.css'

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
    <Tooltip content={`${last.mode}: ${sspan2Clock(last.start, current.start)}`}>
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
    time, setTime, upsertMode, upsertEvent,
  }:
  {
    time: number
    setTime: (time: number) => void
    upsertMode: (info: ModeInfo, delay: boolean) => void
    upsertEvent: (info: EventInfo, delay: boolean) => void
  }
) {
  const {
    modes, events, duration, modeButtons, eventButtons,
  } = useContext(ConfigContext)
  const modeColors = Object.fromEntries(
    modeButtons.map(({ label, bg }) => [label, bg])
  )
  const eventIcons = Object.fromEntries(
    eventButtons.map(({ label, icon }) => [label, icon])
  )

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