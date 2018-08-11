module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import',
  ],
  parser: 'babel-eslint',
  rules: {
    'no-restricted-syntax': 'off',
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never'
    }],
    'max-len': ['warn', 120, { 'ignoreUrls': true }],
    'object-curly-spacing': 'off',
    'global-require': 'warn',
    'import/no-dynamic-require': 'off',
    'no-underscore-dangle': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'prefer-arrow-callback': ['off'],
    'space-before-function-paren': [
      'error', {
        'anonymous': 'never',
        'named': 'always',
        'asyncArrow': 'ignore',
      },
    ],
    'no-unused-vars': [
      'error',
      {
        'vars': 'all',
        'args': 'after-used',
      },
    ],
    'indent': [
      'error',
      2,
      {
        'MemberExpression': 1,
        'SwitchCase': 1,
      },
    ],
    'import/no-extraneous-dependencies': ['off', { 'dev-dependencies': true }],
    'no-undef': ['warn'],
    'no-unused-expressions': ['warn'],
    'no-throw-literal': ['off'],
  },
  env: {
    es6: true,
    node: true,
  },
  globals: {
  }
};
