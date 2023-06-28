"use client"

import { useContext, useRef, useState } from 'react'
import JSON5 from 'json5'
import FoldingMenu from '@/components/FoldingMenu'
import TrackedVideo from '@/components/TrackedVideo'
import { downloadString } from '@/utils'
import ModeDialog from '@/components/ModeDialog'
import Timeline from '@/components/Timeline'
import EventDialog from '@/components/EventDialog'
import Statistics from '@/components/Statistics'
import SourceSelect from '@/components/SourceSelect'
import styles from './page.module.css'
import { ConfigContext, ConfigProvider } from '@/contexts/ConfigurationContext'
import { EventInfo, ModeInfo } from '@/types'

// export const metadata = {
//   title: 'Session Review',
//   description: 'Interface for reviewing a pair programming session.',
// }

export default function Home() {
  const [modeOpen, setModeOpen] = useState(false)
  const [eventOpen, setEventOpen] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
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
    modes, events,
    videoSource, setModes, setEvents,
  } = useContext(ConfigContext)
  // const { connector: activeConnector, isConnected } = useAccount()
  // const { connect, connectors, error, isLoading, pendingConnector } =
  //   useConnect()

  if(!videoSource) {
    return <SourceSelect/>
  }

  if(showStatistics) {
    return <Statistics setVisible={setShowStatistics}/> 
  }

  const modeChanged = ({ label }: { label: string }) => {
    setActiveMode({ mode: label, start: time })
    setModeOpen(true)
  }
  const eventSelected = ({ label }: { label: string }) => {
    setActiveEvent({ event: label, at: time })
    setEventOpen(true)
  }
  const actionSelected = async ({ label }: { label: string }) => {
    const config = {
      video: videoSource,
      buttons: {
        mode: modeButtons,
        event: eventButtons,
      },
      modes,
      events,
    }
    if(label === 'Download Config') {
      downloadString({
        text: JSON5.stringify(config, null, 2),
        mimetype: 'text/javascript',
        filename: `video_config.${new Date().toISOString()}.json5`,
      })
    } else if(label === 'Statistics') {
      setShowStatistics(true)
    } else {
      throw new Error(`Unknown Action: "${label}".`)
    }
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
          console.log({found, prev, info})
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
        <aside className={styles.sidebar}>
          <FoldingMenu
            label="Mode"
            icon="/lens.svg"
            buttons={modeButtons}
            onSelect={modeChanged}
          />
          <FoldingMenu
            label="Event"
            icon="/gavel.svg"
            buttons={eventButtons}
            onSelect={eventSelected}
            elemStyle={{ '--fg': 'black' } as React.CSSProperties}
          />
          <FoldingMenu
            label="Action"
            icon="/actions.svg"
            buttons={actionButtons}
            onSelect={actionSelected}
            elemStyle={{ '--fg': 'black' } as React.CSSProperties}
          />
        </aside>
        <TrackedVideo {...{ setTime }} ref={video}/>
        {activeMode && (
          <ModeDialog
            open={modeOpen}
            setVisible={setModeOpen}
            {...{ upsertMode }}
            mode={activeMode}
          />
        )}
        {activeEvent && (
          <EventDialog
            open={eventOpen}
            setVisible={setEventOpen}
            {...{ upsertEvent }}
            types={eventButtons.map(({ label }) => label)}
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
          modeColors={Object.fromEntries(
            modeButtons.map(({ label, bg }) => [label, bg])
          )}
          eventIcons={Object.fromEntries(
            eventButtons.map(({ label, icon }) => [label, icon])
          )}
        />
      </section>
    </main>
  )
}
