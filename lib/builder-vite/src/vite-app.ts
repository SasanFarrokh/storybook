import {
  LoadOptions,
  loadPreviewOrConfigFile,
  StorybookConfigOptions,
} from '@storybook/core-common';
import { RequestHandler } from 'express';
import glob from 'glob-promise';
import * as path from 'path';
import * as fs from 'fs';
import { storybookPaths } from './utils/storybookPaths';

export const viteAppMiddleware = async (
  options: StorybookConfigOptions & LoadOptions
): Promise<RequestHandler> => {
  const { presets, configDir, framework } = options;

  const clientApi = storybookPaths['@storybook/client-api'];
  const clientLogger = storybookPaths['@storybook/client-logger'];

  const previewEntries = await presets.apply('previewEntries', [], options);
  const frameworkEntry = `/@fs${require.resolve(`@storybook/${framework}`).replace('cjs', 'esm')}`;
  const configEntries = [loadPreviewOrConfigFile({ configDir })]
    .concat(await presets.apply('config', [], options))
    .filter(Boolean);
  const storyEntries = (
    await Promise.all(
      (await presets.apply<string[]>('stories')).map((g) =>
        glob(path.isAbsolute(g) ? g : path.join(configDir, g))
      )
    )
  ).reduce((carry, stories) => carry.concat(stories));

  const configTemplate = fs
    .readFileSync(path.resolve(__dirname, './templates/config.template.txt'))
    .toString();

  const absoluteFilesToImport = (files: string[], name?: string) =>
    files.map((el, i) => `import ${name ? `* as ${name}_${i} from ` : ''}'/@fs${el}'`).join('\n');

  const importArray = (name: string, length: number) =>
    `[${new Array(length)
      .fill(0)
      .map((_, i) => `${name}_${i}`)
      .join(',')}]`;

  return (req, res, next) => {
    if (!req.url.match(/^\/vite-app.js($|\?)/)) {
      next();
      return;
    }
    res.setHeader('Content-Type', 'application/javascript');
    res.status(200).send(
      `
    import '${frameworkEntry}'
    import { addDecorator, addParameters, addLoader, addArgTypesEnhancer } from '${clientApi}';
    import { logger } from '${clientLogger}';
    ${absoluteFilesToImport(configEntries, 'config')}
    import { configure } from '${frameworkEntry}';
    ${absoluteFilesToImport(storyEntries, 'story')}
      
    const configs = ${importArray('config', configEntries.length)}
    configs.forEach(config => {
      ${configTemplate}
    })
    
    configure(() => ${importArray('story', storyEntries.length)}.filter(el => el.default), undefined, false);
    `.trim()
    );
  };
};
