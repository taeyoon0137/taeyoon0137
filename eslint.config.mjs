import base from 'eslint-config-taeyoon/base';

export default [
  {
    ignores: ['.pnp.*', '.yarn/**', 'dist/**', 'node_modules/**'],
  },
  ...base,
];
