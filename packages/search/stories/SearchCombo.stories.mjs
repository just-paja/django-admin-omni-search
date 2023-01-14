/* eslint-disable no-magic-numbers */

import React, { useEffect, useState } from 'react'

import { AdminProvider } from '../context.mjs'
import { SearchCombo } from '../SearchCombo.mjs'

import './stories.scss'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'SearchCombo',
  component: SearchCombo,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    open: { control: 'boolean' },
    results: { control: 'text' },
    selectedIndex: { control: 'number' },
  },
}

const JSON_PADDING = 2

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = args => {
  const [value, setValue] = useState()
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(args.open)
  const argResult = args.results

  useEffect(() => {
    try {
      setResults(JSON.parse(argResult))
    } catch (e) {
      // Intentionally ignored
    }
  }, [argResult])

  useEffect(() => {
    setOpen(args.open)
  }, [args.open])

  return (
    <header>
      <AdminProvider models={[]} searchPath="/admin">
        <div>
          <SearchCombo
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            results={results}
            onSubmit={setValue}
          />
          <pre>{JSON.stringify(value, null, JSON_PADDING)}</pre>
        </div>
      </AdminProvider>
    </header>
  )
}

const defaultResults = JSON.stringify(
  [
    {
      appName: 'auth',
      modelVerbose: 'user',
      key: 'auth.user.1',
      pk: 1,
      text: 'Hans Olo',
    },
    {
      appName: 'auth',
      modelVerbose: 'user',
      key: 'auth.user.2',
      pk: 2,
      text: 'Dar Thvader',
    },
  ],
  null,
  2
)

export const Basic = Template.bind({})
Basic.args = {
  open: true,
  results: defaultResults,
  selectedIndex: 0,
}
