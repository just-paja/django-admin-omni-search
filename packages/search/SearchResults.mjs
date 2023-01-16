import classnames from 'classnames'
import React, { useEffect, useRef } from 'react'

import { useAdmin } from './context.mjs'

import styles from './SearchResults.module.scss'

function SearchResult({ result, selected }) {
  const ref = useRef(null)
  const { appLabel, detailHref, modelName, modelVerbose, pk, text } = result
  const { linkTo } = useAdmin()
  const href = linkTo(appLabel, modelName, pk)

  useEffect(() => {
    if (selected) {
      ref.current.focus()
    }
  }, [selected])

  return (
    <a
      className={classnames(styles.result, { [styles.selected]: selected })}
      href={detailHref || href}
      ref={ref}
    >
      <div className={styles.modelName}>
        {modelVerbose}#{pk}
      </div>
      <div>{text}</div>
    </a>
  )
}

function SearchEmpty() {
  return <div className={styles.empty}>No Results</div>
}

export function SearchResults({ className, open, selectedIndex, results }) {
  return (
    <div
      className={classnames(
        styles.results,
        'omnisearch-results',
        open && styles.open,
        className
      )}
    >
      <div
        className={classnames(styles.resultsInner, 'omnisearch-results-inner')}
      >
        {results.length === 0 && <SearchEmpty />}
        {results.map((result, index) => (
          <SearchResult
            key={result.key}
            result={result}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </div>
  )
}
