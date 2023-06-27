"use client"

import JSON5 from 'json5'
import { httpLink } from '@/utils'
import { ConfigContext } from '@/contexts/ConfigurationContext'
import { useContext } from 'react'
import styles from './SourceSelect.module.css'

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
  const {
    setVideoSource,
    setModeButtons,
    setEventButtons,
    setActionButtons,
    setModes,
    setEvents,
  } = useContext(ConfigContext)

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
              console.log(files)
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
              console.info({ ivs: src })
              setVideoSource(src)
              break
            }
          }
          if (metadata) {
            const { video: videoSource, buttons, modes, events } = metadata
            console.info({ vs: videoSource })
            if(videoSource) setVideoSource(videoSource)
            if(buttons?.mode) setModeButtons(buttons.mode)
            if(buttons?.event) setEventButtons(buttons.event)
            if(buttons?.action) setActionButtons(buttons.action)
            if(modes) setModes(modes)
            if(events) setEvents(events)
          }
        }}
      >
        <fieldset>
          <input type="radio" name="source" value="ceramic" />
          <label>
            <span>Enter a Ceramic Stream ID:</span>
            <input id="ceramic" />
          </label>
        </fieldset>
        <div>or</div>
        <fieldset>
          <input type="radio" name="source" value="file" />
          <label>
            <span>Enter a metadata file:</span>
            <input id="metafile" type="file" />
          </label>
        </fieldset>
        <div>or</div>
        <fieldset>
          <input type="radio" name="source" value="url" defaultChecked />
          <label>
            <span>Enter a metadata URL:</span>
            <input id="metaurl" defaultValue="ipfs://bafybeigko6qg6og6ahwgwe3twoqxbnkywrxxifyk6wvcyt2bhdw4vbgyme/video_config.2023-06-18T15_31_35.824Z.json5" />
          </label>
        </fieldset>
        <div>or</div>
        <fieldset>
          <input type="radio" name="source" value="video" />
          <label>
            <span>Enter a video URL:</span>
            <input id="video" />
          </label>
        </fieldset>
        <div><button>Load</button></div>
      </form>
    </main>
  )
}