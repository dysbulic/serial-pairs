"use client"

import JSON5 from 'json5'
import React, { FormEvent, useContext, useRef, useState } from "react"
import { ConfigContext } from "@/contexts/ConfigurationContext"
import styles from './page.module.css'
import { downloadString, readJSON5, readText } from '@/utils'
import Link from 'next/link'

export default function Configuration() {
  const { getConfig, setConfig } = useContext(ConfigContext)
  const [json, setJSON] = (
    useState(JSON5.stringify(getConfig(), null, 2))
  )
  const files = useRef<HTMLInputElement>(null)

  const submit = (evt: FormEvent) => {
    evt.preventDefault()
    const srcEvent = (evt.nativeEvent ?? evt) as SubmitEvent
    switch((srcEvent.submitter as HTMLButtonElement)?.value) {
      case 'save': {
        setConfig(JSON5.parse(json))
        break
      }
      case 'reset': {
        setJSON(JSON5.stringify(getConfig(), null, 2))
        break
      }
    }
  }

  const load = async (evt: FormEvent) => {
    console.debug('load')
    evt.preventDefault()
    const form = evt.target as HTMLFormElement
    const { files } = form['source'] as HTMLInputElement
    const [file] = Array.from(files ?? [])
    console.debug(`Loading from ${file.name}.`)
    setJSON(await readText(file as File))
  }

  return (
    <main id={styles.config}>
      <menu>
        <Link href="/">⤆</Link>
        <button form="text" value="save">Save</button>
        <button form="text" value="reset">Reset</button>
        <button type="button" onClick={() => files.current?.click()}>
          Load
        </button>
        <button
          type="button"
          onClick={() => {
            downloadString({
              text: json,
              mimetype: 'text/javascript',
              filename: `video_config.${new Date().toISOString()}.json5`,
            })
          }}
        >Download</button>
      </menu>
      <form id={styles.file} onSubmit={load} className={styles.form}>
        <input
          id="source"
          ref={files}
          type="file"
          onChange={({ target }) => { target.form?.requestSubmit() }}
        />
      </form>
      <form id="text" onSubmit={submit} className={styles.form}>
        <textarea
          id={styles.json}
          value={json}
          onChange={({ target: { value } }) => setJSON(value)}
        />
      </form>
    </main>
  )
}