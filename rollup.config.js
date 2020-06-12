import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

export default [{
  input: 'src/index.js',
  output: {
    file: 'public/index.js',
    format: 'esm',
    name: 'core'
  },
  plugins: [
    babel({ 
      sourceMap: true,
      include: ['src/**/*'],
      extensions: ['.js'],
      plugins: [
        '@babel/plugin-proposal-class-properties', 
        ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: false }]
      ]
    }),
    resolve(),
    commonjs(),
  ]
}]
