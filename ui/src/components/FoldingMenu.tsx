"use client"

import { ButtonInfo } from '@/app/page'
import styles from './FoldingMenu.module.css'

const Icon = ({ src, alt = '' }: { src: string, alt?: string }) => {
  if(src.includes('.')) {
    return <img {...{ src, alt }}/>
  }
  return <span className={styles.textIcon}>{src}</span>
}

export default function FoldingMenu(
  {
    label,
    icon,
    bg = 'orange',
    buttons,
    elemStyle = {},
    onSelect = () => {}
  }: {
    label: string
    icon: string
    bg?: string
    buttons: ButtonInfo[]
    elemStyle?: React.CSSProperties
    onSelect?: (args: ButtonInfo) => void
  }
) {
  return (
    <ul className={styles.menu}>
      <li>
        <label
          className={styles.picButton}
          style={{ '--bg': bg } as React.CSSProperties}
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
                  style={{ '--bg': bg } as React.CSSProperties}
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