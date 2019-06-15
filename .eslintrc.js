module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  plugins: ['jest'],
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {},
};
