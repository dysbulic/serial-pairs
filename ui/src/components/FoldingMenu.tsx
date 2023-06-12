import styles from './FoldingMenu.module.css'


export default function FoldingMenu() {
  return (
    <ul className={styles.menu}>
      <li>
        <label className={styles.picButton}>
          <img src="/lens.svg" alt="Mode"/>
          <h2>Mode</h2>
          <input type="checkbox"/>
        </label>
        <ul>
          <li>
            <div
              className={styles.picButton}
              style={{ '--bg': '#016A18' }}
            >
              <span className={styles.textIcon}>🖊</span>
              <h3>New Work</h3>
            </div>
          </li>
          <li>
            <div
              className={styles.picButton}
              style={{ '--bg': '#6A0E01' }}
            >
              <span className={styles.textIcon}>🐞</span>
              <h3>Debugging</h3>
            </div>
          </li>
          <li>
          <div
              className={styles.picButton}
              style={{ '--bg': '#0D1B98' }}
            >
              <span className={styles.textIcon}>🥽</span>
              <h3>Testing</h3>
            </div>
          </li>
          <li>
          <div
              className={styles.picButton}
              style={{ '--bg': '#A59506' }}
            >
              <span className={styles.textIcon}>🗺</span>
              <h3>Planning</h3>
            </div>
          </li>
          <li>
          <div
              className={styles.picButton}
              style={{ '--bg': '#06A5A5' }}
            >
              <span className={styles.textIcon}>💬</span>
              <h3>Chatter</h3>
            </div>
          </li>
          <li>
          <div
              className={styles.picButton}
              style={{ '--bg': '#690E6B' }}
            >
              <span className={styles.textIcon}>🏖</span>
              <h3>Break</h3>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  )
}