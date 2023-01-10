/* istanbul ignore file */
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { createDevServer, getDistDir, transpileScript } from '../../webpack.mjs'

const DEFAULT_PORT = 5001
const BASE_DIR = resolve(dirname(fileURLToPath(import.meta.url)))

export const getTargetDir = () => resolve(getDistDir(), 'djangomni-search')

const getWebpackEnvironment = () => {
  return {
    distDir: getTargetDir(),
    defaultPort: DEFAULT_PORT,
    entryPath: join(BASE_DIR, 'index.mjs'),
    entryPathDev: join(BASE_DIR, 'index.mjs'),
    env: {
      NODE_DEBUG: Boolean(process.env.NODE_DEBUG),
      ...process.env,
    },
  }
}

export const build = () => transpileScript(getWebpackEnvironment())
export const runDevServer = () =>
  createDevServer(getWebpackEnvironment()).start()
