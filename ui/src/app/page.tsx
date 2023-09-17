"use client"

import { useContext, useEffect, useRef, useState } from 'react'
import FoldingMenu from '@/components/FoldingMenu'
import TrackedVideo from '@/components/TrackedVideo'
import ModeDialog from '@/components/ModeDialog'
import Timeline from '@/components/Timeline'
import EventDialog from '@/components/EventDialog'
import SourceSelect from '@/components/SourceSelect'
import styles from './page.module.css'
import { ConfigContext }        from '@/contexts/ConfigurationContext'
import { EventInfo, ModeInfo } from '@/types'

// export const metadata = {
//   title: 'Session Review',
//   description: 'Interface for reviewing a pair programming session.',
// }

export default function Home() {
  const [modeOpen, setModeOpen] = useState(false)
  const [eventOpen, setEventOpen] = useState(false)
  const [time, setTime] = useState(0)
  const [activeMode, setActiveMode] = useState<ModeInfo>()
  const [activeEvent, setActiveEvent] = useState<EventInfo>()
  const video = useRef<HTMLVideoElement>(null)
  // const [provider, setProvider] = useState(
  //   typeof window !== 'undefined' ? (
  //     (window as unknown as { ethereum: any }).ethereum
  //   ) : ( null )
  // )
  const {
    modeButtons, eventButtons, actionButtons,
    videoSource, setModes, setEvents,
  } = useContext(ConfigContext)

  if(!videoSource) {
    return <SourceSelect/>
  }

  const modeChanged = ({ label }: { label: string }) => {
    setActiveMode({ mode: label, start: time })
    setModeOpen(true)
  }
  const eventSelected = ({ label }: { label: string }) => {
    setActiveEvent({ event: label, at: time })
    setEventOpen(true)
  }

  /* Method for inserting objects into the modes and events lists.
   * If `delay` is `true`, the object is opened in the appropriate
   * editing modal. Otherwise the `id` is checked against existing
   * ids to see if this is an update. If it's an update & the label
   * (be it `mode` or `event`) isn't set then the element is
   * deleted. Otherwise the existing elment is replaced. If it is a
   * new element it is appended to the list.
   */
  function upsertFunction<Type extends { id?: string }>(
    setter: (val: (prev: Array<Type>) => Array<Type>) => void,
    activate: (info: Type) => void,
    setVisible: (vis: boolean) => void,
  ) {
    return (info: Type, delay: boolean = false) => {
      if(delay) {
        activate(info)
        setVisible(true)
      } else {
        info.id ??= crypto.randomUUID()
        setter((prev: Array<Type>) => {
          const found = prev.findIndex((m) => m.id === info.id)
          if(found >= 0) {
            if(
              !(info as unknown as ModeInfo).mode
              && !(info as unknown as EventInfo).event
            ) {
              const out = [...prev]
              out.splice(found, 1)
              return out
            } else {
              return [...prev.slice(0, found), info, ...prev.slice(found + 1)]
            }
          } else {
            return [...prev, info]
          }
        })
      }
    }
  }
  const upsertMode = upsertFunction<ModeInfo>(setModes, setActiveMode, setModeOpen)
  const upsertEvent = upsertFunction<EventInfo>(setEvents, setActiveEvent, setEventOpen)

  return (
    <main className={styles.main}>
      <section className={styles.top}>
        <menu className={styles.sidebar}>
          <FoldingMenu
            label={<span><span className="underline">M</span>ode</span>}
            icon="/lens.svg"
            buttons={modeButtons}
            onSelect={modeChanged}
            hotkey="m"
          />
          <FoldingMenu
            label={<span><span className="underline">E</span>vent</span>}
            icon="/gavel.svg"
            buttons={eventButtons}
            onSelect={eventSelected}
            elemStyle={{ '--fg': 'black' } as React.CSSProperties}
            hotkey="e"
          />
          <FoldingMenu
            label={<span><span className="underline">A</span>ction</span>}
            icon="/actions.svg"
            buttons={actionButtons}
            elemStyle={{ '--fg': 'black' } as React.CSSProperties}
            hotkey="a"
          />
        </menu>
        <TrackedVideo {...{ setTime }} ref={video}/>
        {activeMode && (
          <ModeDialog
            open={modeOpen}
            setVisible={setModeOpen}
            upsert={upsertMode}
            mode={activeMode}
          />
        )}
        {activeEvent && (
          <EventDialog
            open={eventOpen}
            setVisible={setEventOpen}
            upsert={upsertEvent}
            event={activeEvent}
          />
        )}
      </section>
      <section className={styles.bottom}>
        <Timeline
          {...{ time, upsertMode, upsertEvent }}
          setTime={(t: number) => {
            setTime(t)
            if(video.current) video.current.currentTime = t
          }}
        />
      </section>
    </main>
  )
}
