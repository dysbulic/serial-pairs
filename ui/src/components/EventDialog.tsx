"use client"

import { FormEvent, useEffect, useRef, useState } from 'react'
import styles from './ModeDialog.module.css'
import { EventInfo } from '@/types'

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
    upsertEvent({
      event: type ?? 'Unknown',
      at: start,
      explanation,
    })
    dialogRef.current?.close()
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <header><h1>Mode Setting</h1></header>
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
            <button formAction="dialog">Cancel</button>
            <button autoFocus>Save</button>
          </section>
        </form>
      </main>
    </dialog>
  )
}