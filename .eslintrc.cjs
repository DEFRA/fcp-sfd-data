module.exports = {
  ignorePatterns: ['.server', '.public', 'src/__fixtures__', 'coverage'],
  overrides: [
    {
      extends: [
        'standard',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:jsdoc/recommended-typescript-flavor',
        'plugin:n/recommended',
        'plugin:promise/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier'
      ],
      env: {
        browser: false
      },
      files: ['**/*.{cjs,js}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      },
      plugins: [
        '@typescript-eslint',
        'import',
        'jsdoc',
        'n',
        'promise',
        'prettier'
      ],
      rules: {
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto'
          }
        ],
        'no-console': 'error',

        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',

        'jsdoc/require-jsdoc': 'off',

        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param-type': 'error',
        'jsdoc/require-param': 'off',

        'jsdoc/require-property-description': 'off',

        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-returns-type': 'off',
        'jsdoc/require-returns': 'off',

        'import/extensions': ['error', 'always', { ignorePackages: true }],

        'import/default': 'off',
        'import/namespace': 'off',
        'n/no-extraneous-require': 'off',
        'n/no-extraneous-import': 'off',
        'n/no-missing-require': 'off',
        'n/no-missing-import': 'off'
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.cjs', '.js']
        },
        'import/resolver': {
          node: true,
          typescript: true
        }
      }
    },
    {
      files: ['**/*.js'],
      parserOptions: {
        sourceType: 'module'
      }
    },
    {
      env: {
        commonjs: true
      },
      files: ['**/*.cjs'],
      parserOptions: {
        sourceType: 'commonjs'
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',

        'n/no-unpublished-require': [
          'error',
          {
            allowModules: []
          }
        ]
      }
    },
    {
      env: {
        browser: true,
        node: false
      },
      files: ['src/client/**/*.js']
    },
    {
      env: {
        'jest/globals': true
      },
      globals: {
        fetchMock: true
      },
      extends: [
        'plugin:jest-formatting/recommended',
        'plugin:jest/recommended',
        'plugin:jest/style'
      ],
      files: ['**/*.test.{cjs,js}', '**/__mocks__/**'],
      plugins: ['jest'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'error',

        'n/no-unpublished-import': [
          'error',
          {
            allowModules: []
          }
        ]
      }
    }
  ],
  root: true
}
