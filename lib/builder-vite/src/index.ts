import { Builder } from '@storybook/core-common';
import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import glob from 'glob-promise';
import path from 'path';
import { createViteServer } from './server';
import { iframeMiddleware } from './iframe';

export const corePresets: string[] = [];

export const overridePresets: string[] = [];

type ViteBuilder = Builder<{}, {}>;

export const getConfig = () => ({});

export const build: ViteBuilder['build'] = async ({ options }) => {};

export const start: ViteBuilder['start'] = async ({ startTime, options, router }) => {
  const { presets, configDir } = options;
  const server = await createViteServer(options);

  const stories: string[] = await presets.apply('stories');

  const files = (
    await Promise.all(stories.map((g) => glob(path.isAbsolute(g) ? g : path.join(configDir, g))))
  ).reduce((a, b) => a.concat(b));

  router.use(iframeMiddleware(options));

  router.use((req, res, next) => server.middlewares.handle(req, res, next));
};

export const bail: ViteBuilder['bail'] = async () => {};
