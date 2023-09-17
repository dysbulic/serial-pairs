"use client"

import JSON5 from 'json5'
import { httpLink, readJSON5 } from '@/utils'
import { ConfigContext } from '@/contexts/ConfigurationContext'
import { FormEvent, useContext } from 'react'
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

  const onSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    const form = evt.target as HTMLFormElement
    let metadata
    switch (form['source'].value) {
      case 'ceramic': {
      }
      case 'file': {
        const { files } = form.querySelector('#metafile') as HTMLInputElement
        const [input] = Array.from(files ?? [])
        metadata = await readJSON5(input)
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
  }

  return (
    <main id={styles.fileselect}>
      <h1>Video Evaluation</h1>
      <img src="/banner.svg" alt="Serial Pairs"/>
      <h2>Choose The Video Source</h2>
      <form {...{ onSubmit }}>
        <fieldset>
          <label>
            <input type="radio" name="source" value="file"/>
          </label>
          <label>
            <span>Enter a metadata file:</span>
            <input id="metafile" type="file" />
          </label>
        </fieldset>
        <div>or</div>
        <fieldset>
          <label>
            <input type="radio" name="source" value="url" defaultChecked/>
          </label>
          <label>
            <span>Enter a metadata URL:</span>
            <input
              id="metaurl"
              defaultValue="ipfs://bafybeifzy3qmre6rituxikmxqhq7jqgmj4whei3vsjq7hbd7dndu6eg3w4/video_config.2023-08-08.json5"
            />
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
        <div>or</div>
        <fieldset>
          <label>
            <input type="radio" name="source" value="new" />
          </label>
          <label>
            <span>Track a new video session</span>
          </label>
        </fieldset>
        <div><button autoFocus>Load</button></div>
      </form>
    </main>
  )
}