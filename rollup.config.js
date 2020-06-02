import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import polyfills from 'rollup-plugin-node-polyfills'

export default [{
  input: 'src/index.js',
  output: {
    file: 'public/index.js',
    format: 'iife',
    name: 'core'
  },
  plugins: [
    resolve(),
    commonjs(),
  ]
}]
