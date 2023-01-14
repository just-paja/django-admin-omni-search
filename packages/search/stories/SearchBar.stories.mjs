import React, { useState } from 'react'

import { AdminProvider } from '../context.mjs'
import { SearchBar } from '../SearchBar.mjs'

import './stories.scss'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'SearchBar',
  component: SearchBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    placeholder: { control: 'text' },
    throttleTime: { control: 'number' },
  },
}

const JSON_PADDING = 2

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = args => {
  const [value, setValue] = useState()
  return (
    <header>
      <AdminProvider model={[]} searchPath="/" placeholder={args.placeholder}>
        <SearchBar {...args} onSubmit={setValue} />
        <pre>{JSON.stringify(value, null, JSON_PADDING)}</pre>
      </AdminProvider>
    </header>
  )
}

export const Basic = Template.bind({})
Basic.args = {
  disabled: false,
  loading: false,
  placeholder: 'Search',
  throttleTime: 150,
}
