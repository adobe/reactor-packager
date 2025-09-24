import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

// Function to handle warnings and suppress external circular dependencies
const onwarn = (warning, warn) => {
  // Suppress circular dependency warnings from node_modules
  if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.message.includes('node_modules')) {
    return;
  }
  // Suppress "this has been rewritten to undefined" warnings from node_modules
  if (warning.code === 'THIS_IS_UNDEFINED' && warning.message.includes('node_modules')) {
    return;
  }
  // Show all other warnings
  warn(warning);
};

export default [
  // ESM build
  {
    input: 'tasks/index.js',
    output: {
      file: 'dist/index.js',
      format: 'esm',
      banner: '#!/usr/bin/env node'
    },
    external: [
      'glob',
      'ramda',
      'yargs',
      'archiver',
      'chalk',
      'fs',
      'path',
      'process',
      '@adobe/reactor-validator',
      'yargs/helpers'
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json()
    ],
    onwarn
  },
  // CommonJS build
  {
    input: 'tasks/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      banner: '#!/usr/bin/env node'
    },
    external: [
      'glob',
      'ramda',
      'yargs',
      'archiver',
      'chalk',
      'fs',
      'path',
      'process',
      '@adobe/reactor-validator',
      'yargs/helpers'
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json()
    ],
    onwarn
  }
];
