module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:prettier/recommended', 'prettier', 'eslint:recommended'],
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: 'tsconfig.json',
    },
    env: {
        es6: true,
        node: true,
    },
    rules: {
        'prettier/prettier': 'error',
        'no-var': 'error',
        indent: ['error', 4, { SwitchCase: 1, ignoredNodes: ['PropertyDefinition'] }],
        'no-multi-spaces': 'error',
        'space-in-parens': 'error',
        'no-multiple-empty-lines': 'error',
        'prefer-const': 'error',
        'no-unused-vars': 'off',
    },
};
