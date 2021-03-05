module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    extends: [
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier',
        // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in 
        // the extends array.
        'plugin:prettier/recommended',
    ],
    rules: {
        //  // Existing rules
        'comma-dangle': 'off', // https://eslint.org/docs/rules/comma-dangle
        'function-paren-newline': 'off', // https://eslint.org/docs/rules/function-paren-newline
        'global-require': 'off', // https://eslint.org/docs/rules/global-require
        'import/no-dynamic-require': 'off', // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
        'no-inner-declarations': 'off', // https://eslint.org/docs/rules/no-inner-declarations
        // New rules
        'class-methods-use-this': 'off',
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        // note you must disable the base rule as it can report incorrect errors
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'max-len': [2, 180],
        'implicit-arrow-linebreak': 'off',
        'prettier/prettier': 'error',
        'no-underscore-dangle': 'off',
        'no-console': 'off',
        'react/jsx-filename-extension': [
            2,
            { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        ],
        'object-curly-newline': 'off',
        'arrow-body-style': 'off',
        'no-unused-vars': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'jsx-a11y/interactive-supports-focus': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'no-param-reassign': 'off',
        'react/jsx-max-props-per-line': ['error', { maximum: 100, when: 'multiline' }],
    },
};