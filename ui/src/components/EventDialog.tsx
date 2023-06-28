"use client"

import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import styles from './ModeDialog.module.css'
import { EventInfo } from '@/types'
import { ConfigContext } from '@/contexts/ConfigurationContext'
import { Icon } from './FoldingMenu'

export default function EventDialog(
  {
    open = false,
    types,
    event: incoming,
    setVisible,
    upsertEvent
  }: {
    open?: boolean
    types: string[]
    event: EventInfo
    setVisible: (open: boolean) => void
    upsertEvent: (args: EventInfo) => void
  }
) {
  const [type, setType] = useState(incoming.event)
  const [start, setStart] = useState(incoming.at)
  const [explanation, setExplanation] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { eventButtons } = useContext(ConfigContext)
  const { icon } = eventButtons.find((b) => b.label === type) ?? {}

  useEffect(() => {
    if(open) {
      setType(incoming.event)
      setStart(incoming.at)
      if(!dialogRef.current?.open) {
        dialogRef.current?.showModal()
      }
    }
  }, [open, incoming])

  useEffect(() => {
    const elem = dialogRef.current
    const close = () => setVisible(false)
    elem?.addEventListener('close', close)
    return () => elem?.removeEventListener('close', close)
  }, [setVisible])

  const submit = (evt: FormEvent) => {
    evt.preventDefault()
    console.info({ 'SUBMITTED': dialogRef.current?.returnValue })
    upsertEvent({
      event: type ?? 'Unknown',
      at: start,
      explanation,
    })
    dialogRef.current?.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      style={{ '--bg': '#000000DD' } as React.CSSProperties}
    >
      <header>
        {icon && <Icon src={icon}/>}
        <h1>Event: {type}</h1>
      </header>
      <main>
        <form onSubmit={submit}>
          <label>
            <h2>Type</h2>
            <select
              id="type"
              value={type}
              onChange={(evt) => setType(evt.target.value)}
            >
              {types.map((type: string) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            <h2>Start Time</h2>
            <input
              id="start"
              type="number"
              value={start}
              onChange={({ target: { value }}) => setStart(Number(value))}
            />
          </label>
          <label>
            <h2>Explanation</h2>
            <textarea
              id="explanation"
              value={explanation}
              onChange={({ target: { value }}) => setExplanation(value)}
            />
          </label>
          <section className={styles.actions}>
          <button 
              className={styles.delete}
              type="button" 
              onClick={() =>{
                upsertEvent({ ...incoming, event: undefined })
                dialogRef.current?.close()
              }}
            >
              Delete
            </button>
            <button formMethod="dialog">Cancel</button>
            <button autoFocus>Save</button>
          </section>
        </form>
      </main>
    </dialog>
  )
}