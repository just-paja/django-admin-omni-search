/* eslint-disable no-magic-numbers */

import React, { useEffect, useState } from 'react'

import { AdminProvider } from '../context.mjs'
import { SearchBar } from '../SearchBar.mjs'
import { SearchResults } from '../SearchResults.mjs'

import './stories.scss'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'SearchResults',
  component: SearchResults,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    disabled: { control: 'boolean' },
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
  const argResult = args.results

  useEffect(() => {
    try {
      setResults(JSON.parse(argResult))
    } catch (e) {
      // Intentionally ignored
    }
  }, [argResult])

  return (
    <AdminProvider models={[]} searchPath="/admin">
      <SearchBar
        disabled={args.disabled}
        open={args.open}
        onSubmit={() => {}}
      />
      <SearchResults
        {...args}
        open={args.open}
        results={results}
        onSelect={setValue}
      />
      <pre>{JSON.stringify(value, null, JSON_PADDING)}</pre>
    </AdminProvider>
  )
}

const defaultResults = JSON.stringify(
  [
    {
      appName: 'auth',
      modelName: 'user',
      key: 'auth.user.1',
      pk: 1,
      text: 'Hans Olo',
    },
    {
      appName: 'auth',
      modelName: 'user',
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
  disabled: true,
  open: true,
  results: defaultResults,
  selectedIndex: 0,
}
