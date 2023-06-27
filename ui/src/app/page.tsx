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
  const [newMode, setNewMode] = useState<ModeInfo>()
  const [newEvent, setNewEvent] = useState<EventInfo>()
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
    setNewMode({ mode: label, start: time })
    setModeOpen(true)
  }
  const eventSelected = ({ label }: { label: string }) => {
    setNewEvent({ event: label, at: time })
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
  function upsertFunction<Type extends { id?: string }>(
    setter: (val: (prev: Array<Type>) => Array<Type>) => void
  ) {
    return (info: Type, index?: number) => {
      info.id ??= crypto.randomUUID()
      setter((prev: Array<Type>) => {
        if(index == null) {
          if(info != null) {
            return [...prev, info] as Array<Type>
          } else {
            return prev as Array<Type>
          }
        } else if(info == null) {
          return prev.splice(index, 1) as Array<Type>
        } else {
          return [...prev.slice(0, index), info, ...prev.slice(index + 1)] as Array<Type>
        }
      })
    }
  }
  const upsertMode = upsertFunction<ModeInfo>(setModes)
  const upsertEvent = upsertFunction<EventInfo>(setEvents)

  return (
    <ConfigProvider>
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
          {newMode && (
            <ModeDialog
              open={modeOpen}
              setVisible={setModeOpen}
              {...{ upsertMode }}
              types={modeButtons.map(({ label }) => label)}
              mode={newMode}
            />
          )}
          {newEvent && (
            <EventDialog
              open={eventOpen}
              setVisible={setEventOpen}
              {...{ upsertEvent }}
              types={eventButtons.map(({ label }) => label)}
              event={newEvent}
            />
          )}
        </section>
        <section className={styles.bottom}>
          <Timeline
            {...{ time, upsertMode }}
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
    </ConfigProvider>
  )
}
