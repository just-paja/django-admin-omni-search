/* istanbul ignore file */
import { build, getTargetDir } from '../webpack.mjs'
import { cp } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const baseDir = resolve(dirname(fileURLToPath(import.meta.url)))
const staticDir = resolve(
  baseDir,
  '..',
  '..',
  'pypi',
  'djangomni_search',
  'static',
  'djangomni-search'
)

build()

await cp(getTargetDir(), staticDir, { recursive: true })
