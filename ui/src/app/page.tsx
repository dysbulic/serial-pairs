import Image from 'next/image'
import FoldingMenu from '../components/FoldingMenu'
import styles from './page.module.css'

export const metadata = {
  title: 'Session Review',
  description: 'Interface for reviewing a pair programming session.',
}

export default function Home() {
  return (
    <main className={styles.main}>
      <FoldingMenu/>
      <video className={styles.video} controls>
        <source
          src="https://bafybeidasi57n6e7upb3txkm6q5ffgoxhbfevx3ny6nlf5ua63xxfillkm.ipfs.dweb.link/2023%E2%81%8405%E2%81%8423%4019%3A35%3A29%E1%B4%87%E1%B4%9B.Pairing%20With%20%40Duke%20On%20Where's%20Waldo%3F.%E2%80%9203%3A35%3A15.x264.mp4"
          type="video/mp4"
        />
      </video>
    </main>
  )
}
