import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  external: (p) => {
    const deps = [
      'fs-extra',
      'path',
    ];
    const r = deps.includes(p);
    return r;
  },
};
