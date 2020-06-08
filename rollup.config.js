import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import polyfills from 'rollup-plugin-node-polyfills'
import { getBabelOutputPlugin as babel } from '@rollup/plugin-babel'

export default [{
  input: 'src/index.js',
  output: {
    file: 'public/index.js',
    format: 'esm',
    name: 'core'
  },
  plugins: [
    babel({ 
      plugins: ['@babel/plugin-proposal-class-properties']
    }),
    resolve(),
    commonjs(),
  ]
}]
