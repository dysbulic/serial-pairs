"use client"

import { useRef, useState } from 'react'
import FoldingMenu from '@/components/FoldingMenu'
import TrackedVideo from '@/components/TrackedVideo'
import styles from './page.module.css'
import ModeDialog from '@/components/ModeDialog'
import Timeline from '@/components/Timeline'
import EventDialog from '@/components/EventDialog'

// export const metadata = {
//   title: 'Session Review',
//   description: 'Interface for reviewing a pair programming session.',
// }

export type ButtonInfo = {
  bg: string
  icon: string
  label: string
}

export type ModeInfo = {
  id?: string
  mode: string
  start: number
}

export type EventInfo = {
  id?: string
  event: string
  at: number
}

export default function Home() {
  const modeButtons = [
    { bg: '#016A18', icon: '🖊', label: 'New Work' },
    { bg: '#6A0E01', icon: '🐞', label: 'Debugging' },
    { bg: '#0D1B98', icon: '🥽', label: 'Testing' },
    { bg: '#A59506', icon: '🗺', label: 'Planning' },
    { bg: '#06A5A5', icon: '💬', label: 'Chatter' },
    { bg: '#690E6B', icon: '🏖', label: 'Break' },
    { bg: '#C27800', icon: '❓', label: 'Unknown' },
  ]
  const eventButtons = [
    { bg: '#24EEBE', icon: '/error.svg', label: 'Standards Error' },
    { bg: '#BEEE24', icon: '/dead day.svg', label: 'Useless Event' },
    { bg: '#EE24BA', icon: '/Spartan.svg', label: 'Right Headed' },
    { bg: '#8399E6', icon: '/stop buffalo.svg', label: 'Wrong Headed' },
    { bg: '#EE410B', icon: '/solutions.svg', label: 'Solution Found' },
  ]
  const [modes, setModes] = useState({})
  const [selectedMode, setSelectedMode] = useState<string>()
  const [modeOpen, setModeOpen] = useState(false)
  const [events, setEvents] = useState<Array<EventInfo>>([])
  const [selectedEvent, setSelectedEvent] = useState<string>()
  const [eventOpen, setEventOpen] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const video = useRef<HTMLVideoElement>(null)
  const modeSelected = ({ label }: { label: string }) => {
    setSelectedMode(label)
    setModeOpen(true)
  }
  const eventSelected = ({ label }: { label: string }) => {
    setSelectedEvent(label)
    setEventOpen(true)
  }
  const insertMode = (info: ModeInfo) => {
    setModes((ms) => ({ ...ms, [info.start]: info }))
  }
  const insertEvent = (info: EventInfo) => {
    setEvents((es) => [...es, info])
  }

  return (
    <main className={styles.main}>
      <section className={styles.top}>
        <aside className={styles.sidebar}>
          <FoldingMenu
            label="Mode"
            icon="/lens.svg"
            buttons={modeButtons}
            onSelect={modeSelected}
          />
          <FoldingMenu
            label="Event"
            icon="/gavel.svg"
            buttons={eventButtons}
            onSelect={eventSelected}
            elemStyle={{ '--fg': 'black' } as React.CSSProperties}
          />
        </aside>
        <TrackedVideo
          {...{ setTime, setDuration}}
          ref={video}
        />
        <ModeDialog
          open={modeOpen}
          {...{ time, setModeOpen, insertMode }}
          types={modeButtons.map(({ label }) => label)}
          type={selectedMode}
        />
        <EventDialog
          open={eventOpen}
          {...{ time, setEventOpen, insertEvent }}
          types={eventButtons.map(({ label }) => label)}
          type={selectedEvent}
        />
      </section>
      <section className={styles.bottom}>
        <Timeline
          {...{ time, events, modes, duration }}
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
