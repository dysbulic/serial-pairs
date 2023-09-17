"use client"

import Tooltip from '@tippyjs/react'
import { ReactElement, useContext, useRef, useState } from 'react'
import type { EventInfo, Maybe, ModeInfo } from '@/types';
import { ConfigContext } from '@/contexts/ConfigurationContext';
import { sspan2Clock } from '@/utils';
import styles from './index.module.css'
import Event from './Event'

type Point = { x: Maybe<number>, y: Maybe<number> }

export const Block = (
  {
    current,
    last,
    duration,
    bg,
    upsertMode,
    setSelectedMode,
    selectedMode,
  }:
  { 
    current: ModeInfo
    last: ModeInfo
    duration: number
    bg: string
    upsertMode?: (info: ModeInfo, delay: boolean) => void
    setSelectedMode?: (id: Maybe<string>) => void
    selectedMode?: Maybe<string>
  }
) => {
  const size = (
    (current.start - last.start) * 100 / duration
  )
  if(size <= 0) return null
  return (
    <Tooltip content={`${last.mode}: ${sspan2Clock(last.start, current.start)}`}>
      <button
        className={styles.block}
        style={{
          '--size': `${size}%`,
          '--bg': bg,
        } as React.CSSProperties}
        onClick={() => { if(!selectedMode) upsertMode?.(last, true) }}
      >
        <span
          className={[
            styles.handle,
            selectedMode === current.id ? styles.selected : ''
          ].join(' ')}
          onMouseDown={() => {
            if(current.id) setSelectedMode?.(current.id)
          }}
          onMouseUp={() => setSelectedMode?.(null)}
          onClick={(e) => e.stopPropagation()}
        >
          {last.start > 0 ? '⧎' : ' '}
        </span>
      </button>
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
    time?: number
    setTime?: (time: number) => void
    upsertMode?: (info: ModeInfo, delay: boolean) => void
    upsertEvent?: (info: EventInfo, delay: boolean) => void
  }
) {
  const {
    modes, events, duration, modeButtons,
  } = useContext(ConfigContext)
  const [selectedMode, setSelectedMode] = (
    useState<Maybe<string>>(null)
  )
  const [selectedTime, setSelectedTime] = (
    useState<Maybe<number>>(null)
  )
  const timeline = useRef<HTMLDivElement>(null)
  time ??= 0
  const modeColors = Object.fromEntries(
    modeButtons.map(({ label, bg }) => [label, bg])
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
    modes.push({ mode: 'Unknown', start: last.start })
  }

  sorted = modes.sort(timeSort)

  if(selectedMode) {
    let end = sorted.findIndex(({ id }) => id === selectedMode) - 1
    if(end < 0) {
      throw new Error(`Mode ${selectedMode} not found.`)
    }
    if(selectedTime != null) {
      let start = end
      if(selectedTime < sorted[end].start) {
        while(start > 0 && sorted[start].start > selectedTime) {
          start--
        }
      } else if(
        end < sorted.length
        && selectedTime > sorted[end + 1].start
      ) {
        while(end < sorted.length && selectedTime > sorted[end].start) {
          end++
        }
        end--
      }
      if(end - start <= 1) {
        sorted[end].start = selectedTime
      }
      console.info({ sorted, start, end })
    }
  }

  const spans: Array<ReactElement> = []
  sorted.forEach((current, idx) => {
    if(idx > 0 && !!last.mode) {
      spans.push(
        <Block
          key={idx}
          {...{ current, last, upsertMode }}
          duration={dur}
          bg={modeColors[last.mode]}
          {...{ setSelectedMode, selectedMode }}
        />
      )
    }
    last = current
  })

  const current = time * 100 / (duration ?? 1)

  const onMouseMove = (e: React.MouseEvent) => {
    if(selectedMode) {
      if(!timeline.current) throw new Error('`timeline` isn’t set.')
      const { width } = timeline.current.getBoundingClientRect()
      setSelectedTime(dur * e.clientX / width)
    }
  }

  return (
    <section
      className={styles.timeline}
      onMouseUp={() => setSelectedMode?.(null)}
      {...{ onMouseMove }}
      ref={timeline}
    >
      <section className={styles.colorbar}>
        {spans}
      </section>
      {setTime && (
        <input
          type="range"
          min="0" max={duration}
          value={time}
          onChange={({ target: { value } }) => {
            setTime?.(Number(value))
          }}
        />
      )}
      <section className={styles.events}>
        {events.map((event, idx) => (
          <Event
            key={idx}
            onClick={upsertEvent}
            {...{ event, duration, timePercent: current }}
          />
        ))}
      </section>
      <nav
        className={styles.tracer}
        style={{ '--pos': current } as React.CSSProperties}
      />
    </section>
  )
}