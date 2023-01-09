/* eslint-disable no-magic-numbers */

import React, { useEffect, useState } from 'react'

import { AdminProvider } from '../context.mjs'
import { SearchBar } from '../SearchBar.mjs'
import { SearchResults } from '../SearchResults.mjs'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'SearchResults',
  component: SearchResults,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
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
    <AdminProvider baseUrl="/admin">
      <SearchBar disabled open onSubmit={() => {}} />
      <SearchResults {...args} results={results} onSelect={setValue} />
      <pre>{JSON.stringify(value, null, JSON_PADDING)}</pre>
    </AdminProvider>
  )
}

const defaultResults = JSON.stringify(
  [
    {
      appName: 'auth',
      modelName: 'user',
      pk: 1,
      str: 'Hans Olo',
    },
    {
      appName: 'auth',
      modelName: 'user',
      pk: 2,
      str: 'Dar Thvader',
    },
  ],
  null,
  2
)

export const Basic = Template.bind({})
Basic.args = {
  results: defaultResults,
  selectedIndex: 0,
}
