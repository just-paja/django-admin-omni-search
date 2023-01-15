import React, { useRef, useState } from 'react'

import { AdminProvider, useAdmin } from './context.mjs'
import { SearchCombo } from './SearchCombo.mjs'

const FLICKER_TIMEOUT = 30

function OmniSearch() {
  const { homePath, fetchResults, publicPath } = useAdmin()
  const cached = useRef([])
  const updateThrottle = useRef(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleUpdate = () => {
    setResults(cached.current)
  }
  const appendResults = (model, data) => {
    cached.current = cached.current
      .filter(
        item =>
          item.appLabel !== model.app.label || item.modelName !== model.ident
      )
      .concat(data)
    clearTimeout(updateThrottle.current)
    setTimeout(handleUpdate, FLICKER_TIMEOUT)
  }

  const handleSearch = value => {
    setLoading(true)
    setOpen(true)
    fetchResults(value.q, appendResults).then(() => {
      setLoading(false)
    })
  }
  return (
    <SearchCombo
      homePath={homePath}
      loading={loading}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      onSearch={handleSearch}
      publicPath={publicPath}
      results={results}
    />
  )
}

export function OmniSearchApp({ config }) {
  return (
    <AdminProvider
      homePath={config.homeUrl}
      placeholder={config.placeholder}
      publicPath={config.publicUrl}
      searchPath={config.searchUrl}
      models={config.models}
    >
      <OmniSearch />
    </AdminProvider>
  )
}
