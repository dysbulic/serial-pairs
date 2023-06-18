"use client"

import { forwardRef, useEffect } from 'react'
import styles from './TrackedVideo.module.css'

export const TrackedVideo = (
  forwardRef(({ setTime, setDuration }, video) => {
    useEffect(() => {
      const elem = video.current
      const update = () => {
        if(elem) setTime(elem.currentTime)
      }
      elem?.addEventListener('timeupdate', update)

      return () => elem?.removeEventListener('timeupdate', update)
    }, [setTime, video])
    useEffect(() => {
      const elem = video.current
      const loaded = () => {
        if(elem) setDuration(elem.duration)
      }
      elem?.addEventListener('loadedmetadata', loaded)

      return () => elem?.removeEventListener('loadedmetadata', loaded)
    }, [setDuration, video])

    return (
      <video className={styles.video} controls ref={video}>
        <source
          src="https://bafybeidasi57n6e7upb3txkm6q5ffgoxhbfevx3ny6nlf5ua63xxfillkm.ipfs.dweb.link/2023%E2%81%8405%E2%81%8423%4019%3A35%3A29%E1%B4%87%E1%B4%9B.Pairing%20With%20%40Duke%20On%20Where's%20Waldo%3F.%E2%80%9203%3A35%3A15.x264.mp4"
          type="video/mp4"
        />
      </video>
    )
  })
)

TrackedVideo.displayName = 'TrackedVideo'

export default TrackedVideo