"use client"

import { useState } from 'react'
import FoldingMenu from '@/components/FoldingMenu'
import TrackedVideo from '@/components/TrackedVideo'
import styles from './page.module.css'
import ModeDialog from '@/components/ModeDialog'

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
  id: string
  mode: string
  start: number
}

export default function Home() {
  const modeButtons = [
    { bg: '#016A18', icon: '🖊', label: 'New Work' },
    { bg: '#6A0E01', icon: '🐞', label: 'Debugging' },
    { bg: '#0D1B98', icon: '🥽', label: 'Testing' },
    { bg: '#A59506', icon: '🗺', label: 'Planning' },
    { bg: '#06A5A5', icon: '💬', label: 'Chatter' },
    { bg: '#690E6B', icon: '🏖', label: 'Break' },
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
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const selected = ({ label }: { label: string }) => {
    setSelectedMode(label)
    setModeOpen(true)
    console.info({ modeOpen })
  }
  const insertMode = (info: ModeInfo) => {
    setModes((modes) => ({ ...modes, [info.id]: info }))
    console.info({ modes })
  }

  return (
    <main className={styles.main}>
      <aside className={styles.sidebar}>
        <FoldingMenu
          label="Mode"
          icon="/lens.svg"
          buttons={modeButtons}
          onSelect={selected}
        />
        <FoldingMenu
          label="Event"
          icon="/gavel.svg"
          buttons={eventButtons}
          elemStyle={{ '--fg': 'black' } as React.CSSProperties}
        />
      </aside>
      <TrackedVideo
        {...{ setTime, setDuration}}
      />
      <ModeDialog
        open={modeOpen}
        {...{ time, setModeOpen, insertMode }}
        types={modeButtons.map(({ label }) => label)}
        type={selectedMode}
      />
    </main>
  )
}
