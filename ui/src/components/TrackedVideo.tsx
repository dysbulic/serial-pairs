"use client"

import { CID } from 'multiformats/cid'
import { ForwardedRef, MutableRefObject, forwardRef, useEffect } from 'react'
import styles from './TrackedVideo.module.css'

type Maybe<T> = T | null

const IPFS_LINK_PATTERN = 'https://w3s.link/ipfs/{cid}/{path}'

export const httpLink = (uri?: Maybe<string>) => {
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

export const TrackedVideo = (
  forwardRef((
    { src, setTime, setDuration }:
    {
      src: string
      setTime: (time: number) => void
      setDuration: (time: number) => void
    },
    video: ForwardedRef<HTMLVideoElement>
  ) => {
    useEffect(() => {
      const elem = (video as MutableRefObject<HTMLVideoElement>)?.current
      const update = () => {
        if(elem) setTime(elem.currentTime)
      }
      elem?.addEventListener('timeupdate', update)

      return () => elem?.removeEventListener('timeupdate', update)
    }, [setTime, video])
    useEffect(() => {
      const elem = (video as MutableRefObject<HTMLVideoElement>)?.current
      const loaded = () => {
        if(elem) setDuration(elem.duration)
      }
      elem?.addEventListener('loadedmetadata', loaded)

      return () => elem?.removeEventListener('loadedmetadata', loaded)
    }, [setDuration, video])

    return (
      <video className={styles.video} controls ref={video}>
        <source
          src={httpLink(src)}
          type={`video/${src.replace(/.*\./, '')}`}
        />
      </video>
    )
  })
)

TrackedVideo.displayName = 'TrackedVideo'

export default TrackedVideo