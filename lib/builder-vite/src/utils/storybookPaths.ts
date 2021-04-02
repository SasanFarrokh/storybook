import * as path from 'path';

const storybookModules = [
  'addons',
  'api',
  'channels',
  'channel-postmessage',
  'components',
  'core-events',
  'router',
  'theming',
  'semver',
  'client-api',
  'client-logger',
] as const;

export const storybookPaths: Record<string, string> = storybookModules.reduce(
  (acc, sbPackage) => ({
    ...acc,
    [`@storybook/${sbPackage}`]: path.dirname(
      require.resolve(`@storybook/${sbPackage}/package.json`)
    ),
  }),
  {}
);
