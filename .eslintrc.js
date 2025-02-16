module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "no-unused-vars": "warn",
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    'no-plusplus': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
    }],
  },
};
