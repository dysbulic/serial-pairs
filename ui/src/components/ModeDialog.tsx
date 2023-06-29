"use client"

import React, { useContext, useEffect, useRef, useState } from 'react'
import { ModeInfo } from '@/types'
import { ConfigContext } from '@/contexts/ConfigurationContext'
import styles from './Dialog.module.css'

export default function ModeDialog(
  {
    open = false,
    mode: incoming,
    setVisible,
    upsert,
  }: {
    open?: boolean
    mode: ModeInfo
    setVisible: (open: boolean) => void
    upsert: (args: ModeInfo) => void
  }
) {
  const [type, setType] = useState(incoming.mode)
  const [start, setStart] = useState(incoming.start)
  const [orientation, setOrientation] = (
    useState(incoming.orientation)
  )
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { modeButtons } = useContext(ConfigContext)
  const types = modeButtons.map(({ label }) => label)
  const { bg } = modeButtons.find((b) => b.label === type) ?? {}

  useEffect(() => {
    if(open) {
      setType(incoming.mode)
      setStart(incoming.start)
      if(!dialogRef.current?.open) {
        dialogRef.current?.showModal()
      }
    }
  }, [open, incoming])

  const submit = () => {
    const elem = dialogRef.current
    switch(elem?.returnValue) {
      case 'save': {
        const out = {
          id: incoming.id,
          mode: type,
          start,
        }
        if(!!orientation) {
          Object.assign(out, { orientation })
        }
        if(out.mode && out.start != null) {
          upsert(out)
        }
        break
      }
      case 'cancel': {
        break
      }
      case 'delete': {
        upsert({ ...incoming, mode: undefined })
        break
      }
    }

  }

  useEffect(() => {
    const elem = dialogRef.current
    const close = () => {
      submit()
      setVisible(false)
    }
    elem?.addEventListener('close', close)
    return () => elem?.removeEventListener('close', close)
  }, [setVisible, incoming, type, start, orientation])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      style={{ '--bg': bg } as React.CSSProperties}
    >
      <header><h1>Mode: {type}</h1></header>
      <main>
        <form method="dialog">
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
          <section id={styles.tracking}>
            {(['On Track', 'Off Track'] as const).map((track) => {
              return (
                <>
                  <h2 id={styles[`${track.at(1)?.toLowerCase()}-track`]}>{track}</h2>
                  {['Correct', 'Incorrect'].map((right, rightIdx) => {
                    const id = `${right.at(0)}${track.at(1)}`.toLowerCase()
                    const value = `${track.toLowerCase()} ${right.toLowerCase()}`
                    return (
                      <>
                        {rightIdx === 0 && (
                          <h2 id={styles[`${id}-right`]}>{right}</h2>
                        )}
                        <input
                          type="radio"
                          name="track"
                          {...{ value }}
                          checked={orientation === value}
                        />
                      </>
                    )
                  })}
                </>
              )
            })}
          </section>
          <section className={styles.actions}>
            {!!incoming.id && (
              <button
                className={styles.delete}
                formNoValidate
                value="delete"
              >
                Delete
              </button>
            )}
            <button formNoValidate value="cancel">Cancel</button>
            <button autoFocus value="save">Save</button>
          </section>
        </form>
      </main>
    </dialog>
  )
}