import ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { LoadOptions, StorybookConfigOptions } from '@storybook/core-common';

export const generateIframeCode = async ({
  presets,
  framework,
  packageJson
}: StorybookConfigOptions & LoadOptions): Promise<string> => {
  const headHtmlSnippet = await presets.apply<string>('previewHeadTemplate');
  const bodyHtmlSnippet = await presets.apply<string>('previewBodyTemplate');
  const logLevel = await presets.apply('logLevel', undefined);
  const frameworkOptions = await presets.apply(`${framework}Options`, {});

  const template = ejs.compile(
    (await fs.promises.readFile(path.resolve(__dirname, './templates/index.ejs'))).toString()
  );
  return template({
    options: {},
    files: {
      css: [],
      js: [
        {
          path: '/vite-app.js',
          module: true,
        },
      ],
    },
    headHtmlSnippet,
    bodyHtmlSnippet,
    version: packageJson.version,
    globals: {
      LOGLEVEL: logLevel,
      FRAMEWORK_OPTIONS: frameworkOptions,
    },
  });
};
