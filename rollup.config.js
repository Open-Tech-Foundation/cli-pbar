import filesize from 'rollup-plugin-filesize';
import { eslint } from 'rollup-plugin-eslint';

import pkg from './package.json';

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [filesize(), eslint({ throwOnError: true })],
  },
];
