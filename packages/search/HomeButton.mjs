import React from 'react'
import styles from './HomeButton.module.scss'

import { FaHome } from 'react-icons/fa/index.esm.js'

export function HomeButton({ href }) {
  return (
    <a href={href} className={styles.button}>
      <FaHome className={styles.icon} />
    </a>
  )
}
