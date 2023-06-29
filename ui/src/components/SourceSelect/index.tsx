"use client"

import JSON5 from 'json5'
import { httpLink } from '@/utils'
import { ConfigContext } from '@/contexts/ConfigurationContext'
import { useContext } from 'react'
import styles from './index.module.css'

export default function SourceSelect(
  // : {
  //   setVideoSrc: (src: string) => void
  //   setModeButtons: (buttons: Array<ButtonInfo>) => void
  //   setEventButtons: (buttons: Array<ButtonInfo>) => void
  //   setActionButtons: (buttons: Array<ButtonInfo>) => void
  //   setModes: (modes: Array<ModeInfo>) => void
  //   setEvents: (events: Array<EventInfo>) => void
  // }
) {
  const { setVideoSource, setConfig } = useContext(ConfigContext)

  return (
    <main id={styles.fileselect}>
      <img src="/banner.svg" alt="Serial Pairs" />
      <form
        onSubmit={async (evt) => {
          evt.preventDefault()
          const form = evt.target as HTMLFormElement
          let metadata
          switch (form['source'].value) {
            case 'ceramic': {
            }
            case 'file': {
              const { files } = form.querySelector('#metafile') as HTMLInputElement
              const [input] = Array.from(files ?? [])
              const reader = new FileReader()
              metadata = await new Promise((resolve) => {
                reader.onload = (evt) => {
                  const { result } = evt.target as FileReader
                  resolve(JSON5.parse(result as string))
                }
                reader.readAsText(input)
              })
              break
            }
            case 'url': {
              const { value: url } = form.querySelector('#metaurl') as HTMLInputElement
              if(!!url) {
                const config = await (await fetch(httpLink(url))).text()
                metadata = JSON5.parse(config)
              }
              break
            }
            case 'video': {
              const { value: src } = form.querySelector('#video') as HTMLInputElement
              setVideoSource(src)
              break
            }
          }
          if(metadata) setConfig(metadata)
        }}
      >
        <fieldset>
          <label>
            <input type="radio" name="source" value="file" />
          </label>
          <label>
            <span>Enter a metadata file:</span>
            <input id="metafile" type="file" />
          </label>
        </fieldset>
        <div>or</div>
        <fieldset>
          <label>
            <input type="radio" name="source" value="url" defaultChecked />
          </label>
          <label>
            <span>Enter a metadata URL:</span>
            <input id="metaurl" defaultValue="ipfs://bafybeihavkdijdwgzivpr6ieieggv4tphjqkciok4xsd6pul7nvvno375q/video_config.2023-06-28T06_46_34.405Z.json5" />
          </label>
        </fieldset>
        <div>or</div>
        <fieldset>
          <label>
            <input type="radio" name="source" value="video" />
          </label>
          <label>
            <span>Enter a video URL:</span>
            <input id="video" />
          </label>
        </fieldset>
        <div><button autoFocus>Load</button></div>
      </form>
    </main>
  )
}