import { EventInfo } from '@/types'
import { s2Clock } from '@/utils'
import Markdown from 'react-markdown'
import Tooltip from '@tippyjs/react'
import { useContext, useEffect, useRef, useState } from 'react'
import { ConfigContext } from '@/contexts/ConfigurationContext'
import remarkGFM from 'remark-gfm'
import styles from './index.module.css'

export default function Event(
  { event, timePercent, onClick }:
  {
    event: EventInfo
    timePercent: number
    onClick?: (evt: EventInfo, something: boolean) => void
  }
) {
  const section = useRef<HTMLDivElement>(null)
  const { duration, eventButtons } = useContext(ConfigContext)
  const eventIcons = Object.fromEntries(
    eventButtons.map(({ label, icon }) => [label, icon])
  )
  const eventColors = Object.fromEntries(
    eventButtons.map(({ label, bg }) => [label, bg])
  )
  const { at, event: type, explanation } = event
  const tooltip = `${s2Clock(at)}: ${type}`
  const percent = at * 100 / (duration ?? 1)
  const framed = Math.abs(percent - timePercent) < 0.5
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const elem = section.current
    if(!elem) throw new Error('No `section` ref.')

    const mouseover = () => setHovered(true)
    const mouseleave = () => setHovered(false)
    elem.addEventListener('mouseover', mouseover)
    elem.addEventListener('mouseleave', mouseleave)

    return () => {
      elem.removeEventListener('mouseover', mouseover)
      elem.removeEventListener('mouseleave', mouseleave)
    }
  }, [])

  return (
    type && (
      <section ref={section}>
        <Tooltip
          content={tooltip}
          placement="bottom"
          visible={framed || hovered}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={[styles.event, framed ? styles.current : ''].join(' ')}
            src={eventIcons[type]}
            alt={type}
            style={{
              '--pos': `${percent}%`,
              '--bg': eventColors[type],
            } as React.CSSProperties}
            onClick={() => onClick?.(event, true)}
          />
        </Tooltip>
        {!!explanation && (
          <aside className="explanation">
            <Markdown remarkPlugins={[remarkGFM]}>
              {explanation}
            </Markdown>
          </aside>
        )}
      </section>
    )
  )
}