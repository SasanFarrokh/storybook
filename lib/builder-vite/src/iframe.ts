import ejs from 'ejs';
import * as fs from 'fs';
import { RequestHandler } from 'express';
import { LoadOptions, StorybookConfigOptions } from '@storybook/core-common';

export const iframeMiddleware = ({
  presets,
  framework,
  packageJson,
}: StorybookConfigOptions & LoadOptions): RequestHandler => async (req, res, next) => {
  const headHtmlSnippet = await presets.apply<string>('previewHeadTemplate');
  const bodyHtmlSnippet = await presets.apply<string>('previewBodyTemplate');
  const ejsTemplate = await presets.apply<string>('previewMainTemplate');
  const logLevel = await presets.apply('logLevel', undefined);
  const frameworkOptions = await presets.apply(`${framework}Options`, {});

  const template = ejs.compile((await fs.promises.readFile(ejsTemplate)).toString());

  if (req.url.match(/^\/iframe.html($|\?)/)) {
    res.send(
      template({
        options: {},
        files: {
          css: [],
          js: [],
        },
        headHtmlSnippet,
        bodyHtmlSnippet,
        version: packageJson.version,
        globals: {
          LOGLEVEL: logLevel,
          FRAMEWORK_OPTIONS: frameworkOptions,
        },
      })
    );
    return;
  }
  next();
};
