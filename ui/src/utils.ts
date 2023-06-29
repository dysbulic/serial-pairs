"use client"

import { CID } from 'multiformats/cid'
import JSON5 from 'json5'
import type { Metadata, ModeInfo } from '@/types'

type Maybe<T> = T | null

const IPFS_LINK_PATTERN = 'https://w3s.link/ipfs/{cid}/{path}'

export function httpLink(str: string): string
export function httpLink(str: undefined | null): undefined
export function httpLink(str?: string): string | undefined

export function httpLink(uri?: Maybe<string>) {
  const [, origCID, path] =
    uri?.match(/^(?:ipfs|dweb):(?:\/\/)?([^/]+)(?:\/(.*))?$/) ?? []

  try {
    if (origCID) {
      const cid = CID.parse(origCID)

      let v0CID = ''
      try {
        v0CID = cid.toV0().toString()
      } catch {}

      let v1CID = ''
      try {
        v1CID = cid.toV1().toString()
      } catch {}

      const pattern = IPFS_LINK_PATTERN;
      return pattern
        .replace(/{cid}/g, origCID)
        .replace(/{v0cid}/g, v0CID)
        .replace(/{v1cid}/g, v1CID)
        .replace(/{path}/g, path ?? '')
    }
  } catch {}

  return uri ?? undefined; // Image.src won't take null
}

export const downloadString = (
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

export const s2Clock = (seconds: number) => (
  new Date(seconds * 1000)
  .toISOString()
  .replace(/^.+T([\d:]+).*$/, '$1')
  .replace(/^[0:]+(.*\d:\d\d)/, '$1'))

export const sspan2Clock = (start: number, end: number) => (
  `${s2Clock(start)}+${s2Clock(end - start)}`
)

export const readText = (input: File) => {
  const reader = new FileReader()
  return new Promise<string>((resolve) => {
    reader.onload = (evt) => {
      const { result } = evt.target as FileReader
      resolve(result as string)
    }
    reader.readAsText(input)
  })
}

export const readJSON5 = async (input: File) => {
  const text = await readText(input)
  return JSON5.parse(text)
}

export const configToGraphQL = (config: Metadata) => (`
  mutation {
    createProgrammingSessionReview(input: {
      content: {
        sessionID: "${config.video}"
        buttons: {
          ${!!config.buttons.mode && (`
            mode: [
              ${
                config.buttons.mode.map(({ label, icon, bg }) => (
                  `{ label: "${label}", icon: "${icon}", bg: "${bg}" }`
                ))
                .join(',\n')
              }
            ]
          `)}
          ${!!config.buttons.event && (`
            event: [
              ${
                config.buttons.event.map(({ label, icon, bg }) => (
                  `{ label: "${label}", icon: "${icon}", bg: "${bg}" }`
                ))
                .join(',\n')
              }
            ]
          `)}
          ${!!config.buttons.action && (`
            action: [
              ${
                config.buttons.action.map(({ label, icon, bg }) => (
                  `{ label: "${label}", icon: "${icon}", bg: "${bg}" }`
                ))
                .join(',\n')
              }
            ]
          `)}
        }
        modes: [
          ${
            Object.entries<ModeInfo>(config.modes).map(([key, { mode, start }]) => (
              `{ mode: "${mode}", start: ${start} }`
            ))
            .join(',\n')
          }

        ]
        events: [
          ${
            config.events.map(({ event, at, explanation }) => (
              `{ event: "${event}", at: ${at}, explanation: "${explanation}" }`
            ))
            .join(',\n')
          }
        ]
      }
    })
    { document { id } }
  }
`)
