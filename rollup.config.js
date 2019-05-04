import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import {uglify} from 'rollup-plugin-uglify';

export default [
  {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/switchem.js',
      format: 'umd',
      name: 'switchem',
      sourcemap: true,
    },
    plugins: [
      resolve({
        mainFields: ['module', 'main'],
      }),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/switchem.min.js',
      format: 'umd',
      name: 'switchem',
    },
    plugins: [
      resolve({
        mainFields: ['module', 'main'],
      }),
      babel({
        exclude: 'node_modules/**',
      }),
      uglify(),
    ],
  },
];
