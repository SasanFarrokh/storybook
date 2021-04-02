export const optimizeDeps = {
  include: [
    'lodash/mapValues',
    'lodash/pick',
    'lodash/isFunction',
    'lodash/isString',
    'lodash/isPlainObject',
    'lodash/pickBy',
    'lodash/uniq',
    'lodash/cloneDeep',
    'prop-types',
    'deep-object-diff',
    'markdown-to-jsx',
    'react-textarea-autosize',
    'uuid-browser/v4',
    '@emotion/styled',
    '@emotion/core',
    'emotion-theming',
    '@emotion/is-prop-valid',
    'polished',
    'doctrine',
    'fast-deep-equal',
    '@mdx-js/react',
    'react',
    'react-dom',
    'ansi-to-html',
    'telejson',
    '@storybook/csf',
    'regenerator-runtime/runtime.js',
    'memoizerific',
    'ts-dedent',
    'stable',
    'store2',
    'util-deprecate',
    'global',
    'html-tags',
    'escodegen',
    'acorn',
    'acorn-jsx',
    'acorn-walk',
    'qs',
  ].filter((m) => {
    try {
      require.resolve(m);
      return true;
    } catch (err) {
      return false;
    }
  }),
  exclude: ['core-js'],
};
