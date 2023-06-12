"use client"

import { useEffect, useRef, useState } from 'react'
import styles from './ModeDialog.module.css'

export default function ModeDialog(
  {
    open = false,
    types,
    type: selectedType,
    time,
    setModeOpen,
    insertMode
  }
) {
  const [type, setType] = useState(selectedType)
  const [start, setStart] = useState(time)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if(open) {
      setType(selectedType)
      setStart(time)
      dialogRef.current?.showModal()
    }
  }, [open, selectedType, time])
  useEffect(() => {
    const elem = dialogRef.current
    const close = () => setModeOpen(false)
    elem?.addEventListener('close', close)
    return () => elem?.removeEventListener('close', close)
  }, [setModeOpen])
  const submit = (evt) => {
    evt.preventDefault()
    const type = evt.target.elements[0].value
    console.info({ t: evt.target })
    insertMode({
      id: time.toString(),
      mode: type,
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
              {types.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            <h2>Start Time</h2>
            <input
              type="number"
              value={time}
              onChange={({ target: { value }}) => setStart(value)}
            />
          </label>
          <button formAction="dialog">Cancel</button>
          <button>Save</button>
        </form>
      </main>
    </dialog>
  )
}