import { Builder } from '@storybook/core-common';
import { createViteServer } from './server';
import { iframeMiddleware } from './iframe';
import { viteAppMiddleware } from './vite-app';

export const corePresets: string[] = [];

export const overridePresets: string[] = [];

type ViteBuilder = Builder<{}, {}>;

export const getConfig = () => ({});

export const build: ViteBuilder['build'] = async ({ options }) => {};

export const start: ViteBuilder['start'] = async ({ startTime, options, router }) => {
  const server = await createViteServer(options);

  router.use(await iframeMiddleware(options));
  router.use(await viteAppMiddleware(options));

  router.use((req, res, next) => server.middlewares.handle(req, res, next));
};

export const bail: ViteBuilder['bail'] = async () => {};
