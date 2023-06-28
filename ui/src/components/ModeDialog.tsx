"use client"

import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import styles from './ModeDialog.module.css'
import { ModeInfo } from '@/types'
import { ConfigContext } from '@/contexts/ConfigurationContext'

export default function ModeDialog(
  {
    open = false,
    mode,
    setVisible,
    upsertMode,
  }: {
    open?: boolean
    mode: ModeInfo
    setVisible: (open: boolean) => void
    upsertMode: (args: ModeInfo) => void
  }
) {
  const [type, setType] = useState(mode.mode)
  const [start, setStart] = useState(mode.start)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { modeButtons } = useContext(ConfigContext)
  const types = modeButtons.map(({ label }) => label)
  const { bg } = modeButtons.find((b) => b.label === mode.mode) ?? {}

  useEffect(() => {
    if(open) {
      setType(mode.mode)
      setStart(mode.start)
      if(!dialogRef.current?.open) {
        dialogRef.current?.showModal()
      }
    }
  }, [open, mode])

  useEffect(() => {
    const elem = dialogRef.current
    const close = () => setVisible(false)
    elem?.addEventListener('close', close)
    return () => elem?.removeEventListener('close', close)
  }, [setVisible])

  const submit = (evt: FormEvent) => {
    evt.preventDefault()
    const out = Object.assign(mode, {
      mode: type ?? 'Unknown',
      start,
    })
    upsertMode(out)
    dialogRef.current?.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      style={{ '--bg': bg } as React.CSSProperties}
    >
      <header><h1>Mode: {type}</h1></header>
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
          <table id={styles.tracking}>
            <tbody>
              <tr><th/><th>On Track</th><th>Off Track</th></tr>
              <tr>
                <th>Correct</th>
                <td><input type="radio" name="track"/></td>
                <td><input type="radio" name="track"/></td>
              </tr>
              <tr>
                <th>Incorrect</th>
                <td><input type="radio" name="track"/></td>
                <td><input type="radio" name="track"/></td>
              </tr>
            </tbody>
          </table>
          <section className={styles.actions}>
            <button 
              className={styles.delete}
              type="button" 
              onClick={() =>{
                upsertMode({ ...mode, mode: undefined })
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