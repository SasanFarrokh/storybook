export const optimizeDeps = {
  include: [
    'lodash/uniq',
    'prop-types',
    'deep-object-diff',
    'lodash/cloneDeep',
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
    'vue',
    'react',
    'react-dom',
    'ansi-to-html',
    'telejson',
    '@storybook/csf',
    'lodash/isPlainObject',
    'lodash/pickBy',
    'regenerator-runtime/runtime.js',
    'memoizerific',
    'ts-dedent',
    'stable',
    'lodash/mapValues',
    'lodash/pick',
    'store2',
    'util-deprecate',
    'global',
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
