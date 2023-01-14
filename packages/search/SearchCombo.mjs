import classnames from 'classnames'
import React, { useEffect, useState } from 'react'

import { HomeButton } from './HomeButton.mjs'
import { SearchBar } from './SearchBar.mjs'
import { SearchResults } from './SearchResults.mjs'

import styles from './SearchCombo.module.scss'

export function SearchCombo({
  homePath,
  loading,
  open,
  onSearch,
  onClose,
  onOpen,
  results,
}) {
  const [selectedIndex, selectIndex] = useState(null)
  const inputSelection = -1

  const handleKeyDown = e => {
    const max = results.length - 1
    if (e.code === 'ArrowUp') {
      e.preventDefault()
      if (selectedIndex === null || selectedIndex === inputSelection) {
        selectIndex(max)
      } else if (selectedIndex === 0) {
        selectIndex(inputSelection)
      } else {
        selectIndex(selectedIndex - 1)
      }
    } else if (e.code === 'ArrowDown') {
      e.preventDefault()
      if (selectedIndex === inputSelection && results.length > 0) {
        selectIndex(0)
      } else if (selectedIndex >= max) {
        selectIndex(inputSelection)
      } else {
        selectIndex(selectedIndex + 1)
      }
    }
  }

  const handleBarSelect = () => {
    selectIndex(inputSelection)
  }

  const handleBarBlur = () => {
    selectIndex(null)
  }

  const handleClosedClick = () => {
    if (!open && results.length) {
      onOpen()
    }
  }

  useEffect(() => {
    const handleEscape = e => {
      if (e.code === 'Escape') {
        selectIndex(null)
        onClose()
      }
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div
      onClick={handleClosedClick}
      onKeyDown={handleKeyDown}
      className={classnames(
        styles.combo,
        'omnisearch-combo',
        open && styles.open
      )}
    >
      <div className={styles.blur} onClick={onClose} />
      <div className={styles.line}>
        <div className={styles.buttons}>
          <HomeButton href={homePath} />
        </div>
        <div className={styles.search}>
          <SearchBar
            className={styles.bar}
            loading={loading}
            open={open}
            onBlur={selectedIndex === inputSelection ? handleBarBlur : null}
            onSelect={handleBarSelect}
            onSubmit={onSearch}
            selected={selectedIndex === inputSelection}
          />
          <SearchResults
            className={styles.popup}
            open={open}
            results={results}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
    </div>
  )
}
