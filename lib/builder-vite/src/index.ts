import { Builder } from '@storybook/core-common';
import { createViteServer } from './server';
import { iframeMiddleware } from './iframe';
import { viteAppMiddleware } from './vite-app';

export const corePresets: string[] = [];

export const overridePresets: string[] = [];

type ViteBuilder = Builder<{}, {}>;

export const getConfig = () => ({});

export const build: ViteBuilder['build'] = async ({ options }) => {};

export const start: ViteBuilder['start'] = async ({ startTime, options, router, server: devServer }) => {
  const server = await createViteServer(options, devServer);

  router.use(await iframeMiddleware(options, server));
  router.use(await viteAppMiddleware(options));

  router.use((req, res, next) => server.middlewares.handle(req, res, next));
};

export const bail: ViteBuilder['bail'] = async () => {};
