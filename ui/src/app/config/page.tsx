"use client"

import JSON5 from 'json5'
import React, { FormEvent, useContext, useState } from "react"
import { ConfigContext } from "@/contexts/ConfigurationContext"
import styles from './page.module.css'
import { downloadString } from '@/utils'
import Link from 'next/link'

export default function Configuration() {
  const { getConfig, setConfig } = useContext(ConfigContext)
  const [json, setJSON] = (
    useState(JSON5.stringify(getConfig(), null, 2))
  )

  const submit = (evt: React.FormEvent) => {
    evt.preventDefault()
    const origEvent = evt.nativeEvent as SubmitEvent
    switch((origEvent.submitter as HTMLButtonElement)?.value) {
      case 'save': {
        const config = JSON5.parse(json)
        console.info({ config })
        setConfig(config)
        break
      }
      case 'reset': {
        setJSON(JSON5.stringify(getConfig(), null, 2))
        break
      }
    }
  }

  return (
    <main id={styles.config}>
      <menu>
        <Link href="/">⤆</Link>
        <button form="text" value="save">Save</button>
        <button form="text" value="reset">Reset</button>
        <button
          id={styles.download}
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