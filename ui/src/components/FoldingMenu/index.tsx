"use client"

import { ButtonInfo } from '@/types'
import React, { ReactNode, useMemo, useState, useEffect } from 'react'
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
    onSelect = () => {},
    hotkey,
  }: {
    label: ReactNode
    icon: string
    bg?: string
    buttons: ButtonInfo[]
    elemStyle?: React.CSSProperties
    onSelect?: (args: ButtonInfo) => void
    hotkey?: string
  }
) {
  const [open, setOpen] = useState(false)
  const id=useMemo(() => crypto.randomUUID(), [])

  useEffect(() => {
    const keylisten = (e: KeyboardEvent) => {
      if([hotkey?.toLowerCase(), hotkey?.toUpperCase()].includes(e.key)) {
        setOpen((o) => !o)
      } else {
        if(open && /\d/.test(e.key)) {
          const num = Number(e.key)
          if(num <= buttons.length) {
            const button = buttons[num - 1]
            if(button.href) {
              window.location.href = button.href
            } else {
              onSelect(button)
            }
          }
        }
        setOpen(false)
      }
    }
    document.addEventListener('keypress', keylisten)

    return () => {
      document.removeEventListener('keypress', keylisten)
    }
  }, [buttons, hotkey, onSelect, open])

  return (
    <ul className={styles.menu}>
      <li>
        <label
          htmlFor={id}
          className={styles.picButton}
          style={{ '--bg': bg } as React.CSSProperties}
        >
          <Icon src={icon} alt={label?.toString()}/>
          <h2>{label}</h2>
        </label>
        <input
          id={id}
          type="checkbox"
          checked={open}
          onChange={() => setOpen((o) => !o)}
          />
        <ul>
          {buttons.map((args, index) => {
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
            const content = (
              <>
                <button className={`underline ${styles.index}`}>
                  {index + 1}
                </button>
                <Icon src={icon} alt={label}/>
                <h3>{label}</h3>
              </>
            )
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