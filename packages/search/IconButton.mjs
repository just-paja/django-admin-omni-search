import React from 'react'
import styles from './IconButton.module.scss'

export function IconButton({ icon: Icon, href }) {
  return (
    <a href={href} className={styles.button}>
      <Icon className={styles.icon} />
    </a>
  )
}
