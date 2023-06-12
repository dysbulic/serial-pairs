"use client"

import styles from './FoldingMenu.module.css'

const Icon = ({ src, alt = '' }) => {
  if(src.includes('.')) {
    return <img {...{ src, alt }}/>
  }
  return <span className={styles.textIcon}>{src}</span>
}

export default function FoldingMenu(
  { label, icon, bg = 'orange', buttons, elemStyle = {}, onSelect = () => {} }
) {
  return (
    <ul className={styles.menu}>
      <li>
        <label
          className={styles.picButton}
          style={{ '--bg': bg }}
        >
          <Icon src={icon} alt={label}/>
          <h2>{label}</h2>
          <input type="checkbox"/>
        </label>
        <ul>
          {buttons.map((args) => {
            const { label, icon, bg } = args
            return (
              <li
                key={label}
                style={elemStyle}
                onClick={() => onSelect(args)}
              >
                <div
                  className={styles.picButton}
                  style={{ '--bg': bg }}
                >
                  <Icon src={icon} alt={label}/>
                  <h3>{label}</h3>
                </div>
              </li>
            )
            })}
        </ul>
      </li>
    </ul>
  )
}