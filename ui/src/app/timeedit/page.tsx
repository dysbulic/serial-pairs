"use client"

import Link from "next/link"
import { FormEvent, useContext, useState } from "react"
import { ConfigContext } from "@/contexts/ConfigurationContext"
import { ButtonInfo, Maybe } from "@/types"
import styles from './index.module.css'

const ButtonForm = (
  { buttons: incoming, submit }:
  { buttons: Array<ButtonInfo>, submit: (evt: FormEvent) => void}
) => {
  const [preview, setPreview] = useState<Maybe<string>>(null)
  const [buttons, setButtons] = useState(incoming)

  const removeButton = (idx: number) => {
    setButtons((bs) => bs.filter((_, i) => i !== idx))
  }

  return (
    <section>
      <form onSubmit={submit} className={styles.buttonForm}>
        <div className={styles.input}>
          <ul>
            <li>
              <span/>
              <span>Label</span>
              <span>Background</span>
              <span>Icon</span>
              <span/>
            </li>

            {buttons.map((button, idx)=>(
              <ButtonEdit
                key={button.label}
                {...{ button, idx, setPreview, removeButton }}
              />
            ))}
          </ul>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => setButtons((bs) => [...bs, {label: '', bg: '', icon: ''}])}
            >➕</button>
            <button>Save</button>
          </div>
        </div>
        <div className={styles.previewHolder}>
          {!!preview && (
            preview.includes('.') ? (
              <img className={styles.preview} src={preview} alt="preview"/>
            ) : (
              <span className={styles.preview}>{preview}</span>
            )
          )}
        </div>
      </form>
    </section>
  )
}

const ButtonEdit = (
  { button, setPreview, idx, removeButton }:
  {
    button: ButtonInfo
    setPreview: (pre: Maybe<string>) => void
    idx: number
    removeButton: (idx: number) => void
  }
) => {
  const [bg, setBg] = useState(button.bg)
  const [icon, setIcon] = useState(button.icon)
  const [label, setLabel] = useState(button.label)
  const [persist, setPersist] = useState(false)

  return (
    <li>
      <button type="button" onClick={() => removeButton(idx)}>🗑</button>
      <input value={label} id={`label-${idx}`} onChange={({target: {value}})=>setLabel(value)}/>
      <input value={bg} id={`bg-${idx}`} onChange={({target: {value}})=>setBg(value)} type="color"/>
      <input value={icon} id={`icon-${idx}`} onChange={({target: {value}})=>setIcon(value)}/>
      <span
        style={{ '--bg': persist ? 'yellow' : null } as React.CSSProperties}
        onMouseEnter={() => setPreview(icon)}
        onMouseLeave={() => {
          if(!persist) setPreview(null)
        }}
        onClick={() => setPersist((p) => !p)}
      >
        {icon.includes('.') ? (
          <img src={icon} alt={label}/>
        ) : (
          icon
        )}
      </span>
    </li>
  )
}
export default function TimeEdit() {
  const {
    eventButtons, modeButtons, setEventButtons, setModeButtons,
  } = useContext(ConfigContext)

  const submitter = (setter: (bs: Array<ButtonInfo>) => void) => (
    (evt: FormEvent) => {
      evt.preventDefault()
      const chunksize = 4

      const elements = Array.from((evt.target as HTMLFormElement).elements)
      const out = []
      console.debug({ elements })
      for(let i = 0; i < elements.length; i += chunksize) {
        const chunk = elements.slice(i, i + chunksize);
        if(chunk.length === chunksize) {
          out.push({
            label: (chunk[1] as HTMLInputElement).value,
            bg: (chunk[2] as HTMLInputElement).value,
            icon: (chunk[3] as HTMLInputElement).value,
          })
        }
      }
      setter(out)
    }
  )
  const submitEvents = submitter(setEventButtons)
  const submitModes = submitter(setModeButtons)

  return (
    <main id={styles.timeedit}>
      <Link href='/' title="Back To Review">⤆</Link>
      <h2>Events</h2>
      <ButtonForm buttons={eventButtons} submit={submitEvents}/>
      <h2>Modes</h2>
      <ButtonForm buttons={modeButtons} submit={submitModes}/>
    </main>
  )
}
