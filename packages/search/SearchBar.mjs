import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'

import { useAdmin } from './context.mjs'
import { ThreeDots, Puff } from 'react-loader-spinner'
import { FaSearch } from 'react-icons/fa/index.esm.js'

import styles from './SearchBar.module.scss'

const translate = str => str

function Icon({ icon: Component, hidden, ...props }) {
  return <Component {...props} className={styles.icon} />
}

function SearchIcon(props) {
  return (
    <div className={styles.fieldIcon}>
      <Icon {...props} icon={FaSearch} />
    </div>
  )
}

function Loader({ hidden, ...props }) {
  const [height, setHeight] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.parentNode.clientHeight)
  })

  return (
    <div
      ref={ref}
      className={classnames(styles.loader, {
        [styles.hiddenIcon]: hidden,
      })}
    >
      <Icon {...props} color="currentColor" height={height} size={height} />
    </div>
  )
}

function SearchStatus({ loading, typing }) {
  return (
    <div className={styles.status}>
      <Loader icon={ThreeDots} hidden={!typing} />
      <Loader icon={Puff} hidden={!loading} />
    </div>
  )
}

function SearchButton({ disabled }) {
  return (
    <button disabled={disabled} type="submit" className={styles.button}>
      {translate('Search')}
    </button>
  )
}

function SearchInput({ disabled, onBlur, onChange, selected }) {
  const { placeholder } = useAdmin()
  const ref = useRef(null)
  const handleValueChange = e => onChange(e.target.value)

  useEffect(() => {
    if (selected) {
      ref.current.focus()
    }
  }, [selected])

  return (
    <input
      className="omnisearch-input"
      disabled={disabled}
      onBlur={onBlur}
      onChange={handleValueChange}
      placeholder={placeholder}
      ref={ref}
      type="search"
    />
  )
}

export function SearchBar({
  className,
  disabled,
  loading,
  open,
  onBlur,
  onSelect,
  onSubmit,
  selected,
  throttleTime = 200,
}) {
  const [q, setQ] = useState('')
  const [typing, setTyping] = useState(false)
  const throttle = useRef(null)

  const handleSubmit = event => {
    if (event) {
      event.preventDefault()
    }
    onSubmit({ q })
  }

  useEffect(() => {
    clearTimeout(throttle.current)
    if (q) {
      setTyping(true)
      throttle.current = setTimeout(() => {
        setTyping(false)
        handleSubmit()
      }, throttleTime)
    }
  }, [q])

  return (
    <form
      onClick={onSelect}
      onSubmit={handleSubmit}
      className={classnames(
        styles.bar,
        'omnisearch-bar',
        open && styles.open,
        className
      )}
    >
      <SearchIcon />
      <SearchInput
        disabled={disabled}
        onBlur={onBlur}
        onChange={setQ}
        selected={selected}
      />
      <SearchButton disabled={disabled} />
      <SearchStatus loading={loading} typing={typing} />
    </form>
  )
}
