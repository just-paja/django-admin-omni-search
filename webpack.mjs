/* istanbul ignore file */
import babelConfig from './babel.config.js'
import dotenv from 'dotenv'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'

import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const BASE_DIR = dirname(fileURLToPath(import.meta.url))
const DEFAULT_PORT = 5001

dotenv.config()

export const getMode = env =>
  env.NODE_ENV === 'production' ? 'production' : 'development'

export const getBabelConfig = () => ({
  test: /\.m?js$/,
  loader: 'babel-loader',
  options: {
    presets: babelConfig.presets,
  },
})

export const getDistDir = () => resolve(BASE_DIR, 'dist')

export const getWebpackConfig = ({ distDir, bundleName, entryPath, env }) => ({
  entry: entryPath,
  mode: getMode(env),
  module: {
    rules: [
      getBabelConfig(),
      {
        test: /s[ac]ss$/,
        use: [
          env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webm)$/i,
        type: 'asset/resource',
      },
    ],
  },
  output: {
    path: distDir,
    filename: bundleName && `${bundleName}.js`,
  },
  plugins: [new webpack.EnvironmentPlugin(env), new MiniCssExtractPlugin()],
  target: 'web',
})

export const transpileScript = async ({ env, ...props }) => {
  const config = getWebpackConfig({
    ...props,
    devtool: 'source-map',
    env: {
      ...env,
      NODE_ENV: 'production',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          test: /\.m?js(\?.*)?$/i,
        }),
      ],
    },
  })
  const compiler = webpack(config)
  return await new Promise((resolvePromise, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }
      const info = stats.toJson()
      if (stats.hasErrors()) {
        const statsErr = new Error()
        statsErr.message = info.errors[0].message
        statsErr.stack = info.errors[0].stack
        return reject(statsErr)
      }
      compiler.close(closeErr => {
        if (closeErr) {
          reject(closeErr)
        }
      })
      if (!err) {
        return resolvePromise(stats)
      }
      return Promise.resolve()
    })
  })
}

const externalLibs = ['react', 'react-dom']

export const createDevServer = webpackEnv => {
  const webpackConfig = getWebpackConfig(webpackEnv)
  const entryPath = resolve(BASE_DIR, '..', webpackEnv.entryPathDev)

  const compilerConfig = {
    ...webpackConfig,
    externals: Object.fromEntries(
      Object.entries(webpackConfig.externals).filter(
        ([libName]) => !externalLibs.includes(libName)
      )
    ),
    entry: entryPath,
    plugins: [...webpackConfig.plugins, new HtmlWebpackPlugin({})],
  }
  const compiler = webpack(compilerConfig)
  const devServerOptions = {
    open: false,
    port: process.env.NODE_PORT || webpackEnv.defaultPort || DEFAULT_PORT,
  }
  return new WebpackDevServer(devServerOptions, compiler)
}
