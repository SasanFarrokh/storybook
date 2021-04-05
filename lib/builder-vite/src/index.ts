import type { RequestHandler } from 'express';
import { Builder, LoadOptions, StorybookConfigOptions } from '@storybook/core-common';
import { ViteDevServer } from "vite";
import { createViteServer } from './server';
import { generateIframeCode } from './iframe';
import { generateViteAppCode } from './vite-app';

export const corePresets: string[] = [];

export const overridePresets: string[] = [];

type ViteBuilder = Builder<{}, {}>;

export const getConfig = () => ({});

export const build: ViteBuilder['build'] = async ({ options }) => {};

function iframeMiddleware(
  options: StorybookConfigOptions & LoadOptions,
  server: ViteDevServer
): RequestHandler {
  return async (req, res, next) => {
    if (!req.url.match(/^\/iframe.html($|\?)/)) {
      next();
      return;
    }
    const generated = await generateIframeCode(options);
    const transformed = await server.transformIndexHtml('/iframe.html', generated);
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(transformed);
  };
}

function viteAppMiddleware(options: StorybookConfigOptions & LoadOptions): RequestHandler {
  return async (req, res, next) => {
    if (!req.url.match(/^\/vite-app.js($|\?)/)) {
      next();
      return;
    }
    const generated = await generateViteAppCode(options);
    res.setHeader('Content-Type', 'application/javascript');
    res.status(200).send(generated);
  };
}

export const start: ViteBuilder['start'] = async ({ startTime, options, router, server: devServer }) => {
  const server = await createViteServer(options, devServer);

  router.use(await iframeMiddleware(options, server));
  router.use(await viteAppMiddleware(options));

  router.use((req, res, next) => server.middlewares.handle(req, res, next));
};

export const bail: ViteBuilder['bail'] = async () => {};
