"use client"

import { ForwardedRef, MutableRefObject, forwardRef, useEffect } from 'react'
import { httpLink } from '@/utils'
import styles from './TrackedVideo.module.css'

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