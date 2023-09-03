module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: 'airbnb-base',
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                '.eslintrc.{js,cjs}',
            ],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['error', 4],
        'max-len': ['error', { code: 80 }],
        'import/no-extraneous-dependencies': [
            'off',
            {
                devDependencies: true,
            },
        ],
    },
    globals: {
        $: true,
        rrule: true,
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
    },
};
