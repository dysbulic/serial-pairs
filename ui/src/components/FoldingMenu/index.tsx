"use client"

import { ButtonInfo } from '@/types'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import styles from './index.module.css'

export const Icon = ({ src, alt = '' }: { src: string, alt?: string }) => {
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
  const [open, setOpen] = useState(false)
  const id=useMemo(() => crypto.randomUUID(), [])


  return (
    <ul className={styles.menu}>
      <li>
        <label
          htmlFor={id}
          className={styles.picButton}
          style={{ '--bg': bg } as React.CSSProperties}
        >
          <Icon src={icon} alt={label}/>
          <h2>{label}</h2>
        </label>
        <input
          id={id}
          type="checkbox"
          checked={open}
          onChange={() => setOpen((o) => !o)}
          />
        <ul>
          {buttons.map((args) => {
            const { label, icon, bg, href } = args
            const outerProps: { onClick?: () => void } = {}
            if(!href) {
              outerProps.onClick = () => {
                setOpen(false)
                onSelect(args)
              }
            }
            const innerProps = {
              className: styles.picButton,
              style: { '--bg': bg } as React.CSSProperties
            }
            const content = <>
              <Icon src={icon} alt={label}/>
              <h3>{label}</h3>
            </>
            return (
              <li
                key={label}
                style={elemStyle}
                {...outerProps}
              >
                {!!href ? (
                  <Link {...innerProps} {...{ href }}>{content}</Link>
                ) : (
                  <div {...innerProps}>{content}</div>
                )}
              </li>
            )
            })}
        </ul>
      </li>
    </ul>
  )
}