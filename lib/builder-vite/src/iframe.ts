import ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { RequestHandler } from 'express';
import { LoadOptions, StorybookConfigOptions } from '@storybook/core-common';
import { ViteDevServer } from "vite";

export const iframeMiddleware = async ({
  presets,
  framework,
  packageJson
}: StorybookConfigOptions & LoadOptions, server: ViteDevServer): Promise<RequestHandler> => {
  const headHtmlSnippet = await presets.apply<string>('previewHeadTemplate');
  const bodyHtmlSnippet = await presets.apply<string>('previewBodyTemplate');
  const logLevel = await presets.apply('logLevel', undefined);
  const frameworkOptions = await presets.apply(`${framework}Options`, {});

  const template = ejs.compile(
    (await fs.promises.readFile(path.resolve(__dirname, './templates/index.ejs'))).toString()
  );

  return async (req, res, next) => {
    if (!req.url.match(/^\/iframe.html($|\?)/)) {
      next();
      return;
    }
    res.send(
      await server.transformIndexHtml('/iframe.html', template({
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
      })
    ));
  };
};
