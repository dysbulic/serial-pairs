"use client"

import { FormEvent, useEffect, useRef, useState } from 'react'
import styles from './ModeDialog.module.css'
import { ModeInfo } from '@/app/page'

export default function ModeDialog(
  {
    open = false,
    types,
    type: selectedType,
    time,
    setModeOpen,
    insertMode
  }: {
    open?: boolean
    types: string[]
    type?: string
    time: number
    setModeOpen: (open: boolean) => void
    insertMode: (args: ModeInfo) => void
  }
) {
  const [type, setType] = useState(selectedType)
  const [start, setStart] = useState(time)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if(open) {
      setType(selectedType)
      setStart(time)
      console.info({ D: dialogRef.current })
      if(!dialogRef.current?.open) {
        dialogRef.current?.showModal()
      }
    }
  }, [open, selectedType, time])
  useEffect(() => {
    const elem = dialogRef.current
    const close = () => setModeOpen(false)
    elem?.addEventListener('close', close)
    return () => elem?.removeEventListener('close', close)
  }, [setModeOpen])
  const submit = (evt: FormEvent) => {
    evt.preventDefault()
    console.info({ t: evt.target })
    insertMode({
      id: time.toString(),
      mode: type ?? 'Unknown',
      start,
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
          <section className={styles.actions}>
            <button formAction="dialog">Cancel</button>
            <button>Save</button>
          </section>
        </form>
      </main>
    </dialog>
  )
}