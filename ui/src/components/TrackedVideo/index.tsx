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
    const { videoSource, captions, setDuration } = useContext(ConfigContext)

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
        if(elem) {
          setDuration(elem.duration)
          if(elem.textTracks[0]) {
            elem.textTracks[0].mode = 'showing'
          }
        }
      }
      elem?.addEventListener('loadedmetadata', loaded)

      return () => elem?.removeEventListener('loadedmetadata', loaded)
    }, [setDuration, video])

    useEffect(() => {
      const elem = (video as MutableRefObject<HTMLVideoElement>)?.current
      const keylisten = (e: KeyboardEvent) => {
        if(elem) {
          if(e.key === ' ') {
            if(elem.paused) {
              elem.play()
            } else {
              elem.pause()
            }
          }
        }
      }
      elem?.addEventListener('keypress', keylisten)

      return () => elem?.removeEventListener('keypress', keylisten)
    }, [setDuration, video])

    return (
      <video className={styles.video} controls ref={video} crossOrigin="anonymous">
        <source
          src={httpLink(videoSource)}
          type={`video/${videoSource?.replace(/.*\./, '')}`}
        />
        {captions && <track kind="captions" default src={httpLink(captions)}/>}
      </video>
    )
  }
)

TrackedVideo.displayName = 'TrackedVideo'

export default TrackedVideo