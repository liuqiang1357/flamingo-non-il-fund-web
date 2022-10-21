const fs = require('fs');

const foldersUnderSrc = fs
  .readdirSync('./src', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

module.exports = {
  root: true,
  extends: ['react-app', 'eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['import'],
  rules: {
    eqeqeq: 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "BinaryExpression:matches([operator='!='], [operator='==']):not(:matches([left.type='Identifier'][left.name='undefined'], [right.type='Identifier'][right.name='undefined']))",
        message:
          'Usage of "!=" and "==" without "undefined" is deprecated; use "!==" or "!==" instead',
      },
      {
        selector:
          "BinaryExpression:matches([operator='!=='], [operator='===']) > Identifier[name='undefined']",
        message: 'Usage of "!==" or "===" with "undefined" is deprecated; use "!=" or "==" instead',
      },
      {
        selector:
          ":not(BinaryExpression:matches([operator='!=='], [operator='==='])) > Literal[value=null]",
        message:
          'Usage of "null" is deprecated except when received from legacy APIs; use "undefined" instead',
      },
    ],
    'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        pathGroups: [{ pattern: `{${foldersUnderSrc.join(',')}}{,/**}`, group: 'internal' }],
        pathGroupsExcludedImportTypes: [],
      },
    ],
    'jsx-a11y/alt-text': 'off',
    'react/self-closing-comp': 'error',
  },
  overrides: [
    {
      files: ['*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': [
          'error',
          { allowArgumentsExplicitlyTypedAsAny: true },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/strict-boolean-expressions': ['warn'],
      },
    },
  ],
};
