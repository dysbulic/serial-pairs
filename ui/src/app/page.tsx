"use client"

// import { useAccount, useConnect } from 'wagmi'
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import { useRef, useState } from 'react'
import JSON5 from 'json5'
import { jsonToGraphQLQuery as toGraphQL } from 'json-to-graphql-query'
import { ComposeClient }from '@composedb/client'
import { definition } from '../../../ceramic/models/ProgrammingSession.runtime'
import type { RuntimeCompositeDefinition } from '@composedb/types';
import FoldingMenu from '@/components/FoldingMenu'
import TrackedVideo, { httpLink } from '@/components/TrackedVideo'
import styles from './page.module.css'
import ModeDialog from '@/components/ModeDialog'
import Timeline from '@/components/Timeline'
import EventDialog from '@/components/EventDialog'
import { metadata } from './layout'
import Statistics from '@/components/Statistics'

// export const metadata = {
//   title: 'Session Review',
//   description: 'Interface for reviewing a pair programming session.',
// }

export type ButtonInfo = {
  bg: string
  icon: string
  label: string
}

export type ModeInfo = {
  id?: string
  mode: string
  start: number
}

export type EventInfo = {
  id?: string
  event: string
  at: number
  explanation?: string
}

const downloadString = (
  { text, mimetype, filename }:
  { text: string, mimetype: string, filename: string }
) => {
  var blob = new Blob([text], { type: mimetype });

  const a = document.createElement('a')
  a.download = filename
  a.href = URL.createObjectURL(blob)
  a.dataset.downloadurl = [mimetype, a.download, a.href].join(':')
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => { URL.revokeObjectURL(a.href) }, 1500)
}

const defaultButtons = {
  mode: [
    { bg: '#016A18', icon: '🖊', label: 'New Work' },
    { bg: '#6A0E01', icon: '🐞', label: 'Debugging' },
    { bg: '#0D1B98', icon: '🥽', label: 'Testing' },
    { bg: '#A59506', icon: '🗺', label: 'Planning' },
    { bg: '#06A5A5', icon: '💬', label: 'Chatter' },
    { bg: '#690E6B', icon: '🏖', label: 'Break' },
    { bg: '#C27800', icon: '❓', label: 'Unknown' },
  ],
  event: [
    { bg: '#24EEBE', icon: '/error.svg', label: 'Standards Error' },
    { bg: '#BEEE24', icon: '/dead day.svg', label: 'Useless Event' },
    { bg: '#EE24BA', icon: '/Spartan.svg', label: 'Right Headed' },
    { bg: '#8399E6', icon: '/stop buffalo.svg', label: 'Wrong Headed' },
    { bg: '#EE410B', icon: '/solutions.svg', label: 'Solution Found' },
  ],
  action: [
    { bg: '#FFA8A8', icon: '/download.svg', label: 'Download Config' },
    { bg: '#FFD5A8', icon: '/ceramic.svg', label: 'Save To Ceramic' },
    { bg: '#FFA8A8', icon: '📈', label: 'Statistics' },
  ],
}

export default function Home() {
  const [modeButtons, setModeButtons] = useState(defaultButtons.mode)
  const [eventButtons, setEventButtons] = useState(defaultButtons.event)
  const [actionButtons, setActionButtons] = useState(defaultButtons.action)
  const [videoSrc, setVideoSrc] = useState<string>()
  const [modes, setModes] = useState({})
  const [selectedMode, setSelectedMode] = useState<string>()
  const [modeOpen, setModeOpen] = useState(false)
  const [events, setEvents] = useState<Array<EventInfo>>([])
  const [selectedEvent, setSelectedEvent] = useState<string>()
  const [eventOpen, setEventOpen] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const video = useRef<HTMLVideoElement>(null)
  const [provider, setProvider] = useState(
    typeof window !== 'undefined' ? (
      (window as unknown as { ethereum: any }).ethereum
    ) : ( null )
  )
  // const { connector: activeConnector, isConnected } = useAccount()
  // const { connect, connectors, error, isLoading, pendingConnector } =
  //   useConnect()

  if(!videoSrc) {
    return (
      <main id={styles.fileselect}>
        <img src="/banner.svg" alt="Serial Pairs"/>
        <form
          onSubmit={async (evt) => {
            evt.preventDefault()
            const form = evt.target as HTMLFormElement
            let metadata
            switch(form['source'].value) {
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
                setVideoSrc(src)
                break
              }
            }
            if(metadata) {
              console.log(metadata)
              const { video, buttons, modes, events } = metadata
              if(video) setVideoSrc(video)
              if(buttons?.mode) setModeButtons(buttons.mode)
              if(buttons?.event) setEventButtons(buttons.event)
              if(buttons?.action) setActionButtons(buttons.action)
              if(modes) setModes(modes)
              if(events) setEvents(events)
            }
          }}
        >
          <fieldset>
            <input type="radio" name="source" value="ceramic"/>
            <label>
              <span>Enter a Ceramic Stream ID:</span>
              <input id="ceramic"/>
            </label>
          </fieldset>
          <div>or</div>
          <fieldset>
            <input type="radio" name="source" value="file"/>
            <label>
              <span>Enter a metadata file:</span>
              <input id="metafile" type="file"/>
            </label>
          </fieldset>
          <div>or</div>
          <fieldset>
            <input type="radio" name="source" value="url" defaultChecked/>
            <label>
              <span>Enter a metadata URL:</span>
              <input id="metaurl" defaultValue="ipfs://bafybeigko6qg6og6ahwgwe3twoqxbnkywrxxifyk6wvcyt2bhdw4vbgyme/video_config.2023-06-18T15_31_35.824Z.json5"/>
            </label>
          </fieldset>
          <div>or</div>
          <fieldset>
            <input type="radio" name="source" value="video"/>
            <label>
              <span>Enter a video URL:</span>
              <input id="video"/>
            </label>
          </fieldset>
          <div><button>Load</button></div>
        </form>
      </main>
    )
  }

  if(showStatistics) {
    const config = {
      video: videoSrc,
      buttons: {
        mode: modeButtons,
        event: eventButtons,
        action: actionButtons,
      },
      modes,
      events,
    }
    return <Statistics {...{ config, setShowStatistics }} /> 
  }

  const modeSelected = ({ label }: { label: string }) => {
    setSelectedMode(label)
    setModeOpen(true)
  }
  const eventSelected = ({ label }: { label: string }) => {
    setSelectedEvent(label)
    setEventOpen(true)
  }
  const actionSelected = async ({ label }: { label: string }) => {
    const config = {
      video: videoSrc,
      buttons: {
        mode: modeButtons,
        event: eventButtons,
      },
      modes,
      events,
    }
    if(label === 'Download Config') {
      downloadString({
        text: JSON5.stringify(config, null, 2),
        mimetype: 'text/javascript',
        filename: `video_config.${new Date().toISOString()}.json5`,
      })
    } else if(label === 'Statistics') {
      setShowStatistics(true)

    } else if(label === 'Save To Ceramic') {
      const addresses = await provider.request({ method: 'eth_requestAccounts' })
      const accountId = await getAccountId(provider, addresses[0])
      const authMethod = await EthereumWebAuth.getAuthMethod(provider, accountId)

      const composedb = (
        new ComposeClient({
          ceramic: process.env.CERAMIC_URL ?? 'http://localhost:7007',
          definition: definition as RuntimeCompositeDefinition,
        })
      )

      const session = await DIDSession.authorize(
        authMethod, { resources: composedb.resources }
      )
      composedb.setDID(session.did)

      const progSesh = await composedb.executeQuery(`
        mutation {
          createProgrammingSession(input: {
            content: { videoURL: "${videoSrc}" }
          })
          { document { id } }
        }
      `)
      type idedDoc = { document: { id: string } }
      const { id: vidId } = (
        (progSesh?.data?.createProgrammingSession as idedDoc).document ?? {}
      )
      if(!!vidId) {
        const configGraphQL = `
          mutation {
            createProgrammingSessionReview(input: {
              content: {
                sessionID: "${vidId}"
                buttons: {
                  mode: [
                    ${
                      modeButtons.map(({ label, icon, bg }) => (
                        `{ label: "${label}", icon: "${icon}", bg: "${bg}" }`
                      ))
                      .join(',\n')
                    }
                  ]
                  event: [
                    ${
                      eventButtons.map(({ label, icon, bg }) => (
                        `{ label: "${label}", icon: "${icon}", bg: "${bg}" }`
                      ))
                      .join(',\n')
                    }
                  ]
                  action: [
                    ${
                      actionButtons.map(({ label, icon, bg }) => (
                        `{ label: "${label}", icon: "${icon}", bg: "${bg}" }`
                      ))
                      .join(',\n')
                    }
                  ]
                }
                modes: [
                  ${
                    Object.entries<ModeInfo>(modes).map(([key, { mode, start }]) => (
                      `{ mode: "${mode}", start: ${start} }`
                    ))
                    .join(',\n')
                  }

                ]
                events: [
                  ${
                    events.map(({ event, at, explanation }) => (
                      `{ event: "${event}", at: ${at}, explanation: "${explanation}" }`
                    ))
                    .join(',\n')
                  }
                ]
              }
            })
            { document { id } }
          }

        `
        const review = await composedb.executeQuery(configGraphQL)
        console.log({ configGraphQL, review })
      }
    }
  }
  const insertMode = (info: ModeInfo) => {
    setModes((ms) => ({ ...ms, [info.start]: info }))
  }         
  const upsertEvent = (info: EventInfo, index?: number) => {
    setEvents((es) => {
      if(index == null) {
        return [...es, info]
      } else if(info == null) {
        return es.splice(index, 1)
      } else {
        return [...es.slice(0, index), info, ...es.slice(index + 1)]
      }
    })
  }

  return (
    <main className={styles.main}>
      <section className={styles.top}>
        <aside className={styles.sidebar}>
          <FoldingMenu
            label="Mode"
            icon="/lens.svg"
            buttons={modeButtons}
            onSelect={modeSelected}
          />
          <FoldingMenu
            label="Event"
            icon="/gavel.svg"
            buttons={eventButtons}
            onSelect={eventSelected}
            elemStyle={{ '--fg': 'black' } as React.CSSProperties}
          />
          <FoldingMenu
            label="Action"
            icon="/actions.svg"
            buttons={actionButtons}
            onSelect={actionSelected}
            elemStyle={{ '--fg': 'black' } as React.CSSProperties}
          />
        </aside>
        <TrackedVideo
          {...{ setTime, setDuration}}
          src={videoSrc}
          ref={video}
        />
        <ModeDialog
          open={modeOpen}
          {...{ time, setModeOpen, insertMode }}
          types={modeButtons.map(({ label }) => label)}
          type={selectedMode}
        />
        <EventDialog
          open={eventOpen}
          {...{ time, setEventOpen, upsertEvent }}
          types={eventButtons.map(({ label }) => label)}
          type={selectedEvent}
        />
      </section>
      <section className={styles.bottom}>
        <Timeline
          {...{ time, events, modes, duration }}
          setTime={(t: number) => {
            setTime(t)
            if(video.current) video.current.currentTime = t
          }}
          modeColors={Object.fromEntries(
            modeButtons.map(({ label, bg }) => [label, bg])
          )}
          eventIcons={Object.fromEntries(
            eventButtons.map(({ label, icon }) => [label, icon])
          )}
        />
      </section>
    </main>
  )
}
