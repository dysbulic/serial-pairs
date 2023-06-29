"use client"

import { ForwardedRef, MutableRefObject, forwardRef, useContext, useEffect } from 'react'
import { httpLink } from '@/utils'
import { ConfigContext } from '@/contexts/ConfigurationContext'
import styles from './index.module.css'

export const TrackedVideo = forwardRef(
  (
    { setTime }: { setTime: (t: number) => void },
    video: ForwardedRef<HTMLVideoElement>,
  ) => {
    const { videoSource, setDuration } = useContext(ConfigContext)
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
          src={httpLink(videoSource)}
          type={`video/${videoSource?.replace(/.*\./, '')}`}
        />
      </video>
    )
  }
)

TrackedVideo.displayName = 'TrackedVideo'

export default TrackedVideo