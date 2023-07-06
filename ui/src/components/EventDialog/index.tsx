"use client"

import React, { useContext, useEffect, useRef, useState } from 'react'
import { EventInfo } from '@/types'
import { ConfigContext } from '@/contexts/ConfigurationContext'
import { Icon } from '../FoldingMenu'
import general from '../Dialog.module.css'
import styles from './index.module.css'

export default function EventDialog(
  {
    open = false,
    event: incoming,
    setVisible,
    upsert,
  }: {
    open?: boolean
    event: EventInfo
    setVisible: (open: boolean) => void
    upsert: (args: EventInfo) => void
  }
) {
  const [type, setType] = useState(incoming.event)
  const [start, setStart] = useState(incoming.at)
  const [explanation, setExplanation] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { eventButtons } = useContext(ConfigContext)
  const { icon } = eventButtons.find((b) => b.label === type) ?? {}
  const types = eventButtons.map(({ label }) => label)

  useEffect(() => {
    if(open) {
      setType(incoming.event)
      setStart(incoming.at)
      setExplanation(incoming.explanation ?? '')
      if(!dialogRef.current?.open) {
        dialogRef.current?.showModal()
      }
    }
  }, [open, incoming])

  useEffect(() => {
    const elem = dialogRef.current
    const close = () => {
      switch(elem?.returnValue) {
        case 'save': {
          const evt = {
            ...incoming,
            event: type ?? 'Unknown',
            at: start,
          }
          if(!!explanation) {
            Object.assign(evt, { explanation })
          }
          upsert(evt)
          break
        }
        case 'cancel': {
          break
        }
        case 'delete': {
          upsert({ ...incoming, event: undefined })
          break
        }
      }
      setVisible(false)
    }
    elem?.addEventListener('close', close)
    return () => elem?.removeEventListener('close', close)
  }, [setVisible, incoming, type, start, explanation, upsert])

  return (
    <dialog
      ref={dialogRef}
      className={general.dialog}
      style={{ '--bg': '#000000DD' } as React.CSSProperties}
    >
      <header>
        {icon && <Icon src={icon}/>}
        <h1>Event: {type}</h1>
      </header>
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
          <label>
            <h2>Explanation</h2>
            <textarea
              id="explanation"
              value={explanation}
              onChange={({ target: { value }}) => setExplanation(value)}
            />
          </label>
          <section className={general.actions}>
            <button 
              className={general.delete}
              formNoValidate
              type="submit"
              value="delete"
            >
              Delete
            </button>
            <button
              formNoValidate
              value="cancel"
            >Cancel</button>
            <button autoFocus value="save">Save</button>
          </section>
        </form>
      </main>
    </dialog>
  )
}