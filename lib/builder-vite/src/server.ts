import path from 'path';
import { createServer, ViteDevServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import type { LoadOptions } from '@storybook/core-common';

export async function createViteServer({ configDir }: LoadOptions): Promise<ViteDevServer> {
  const server = await createServer({
    configFile: false,
    root: path.resolve(configDir, '..'),
    server: {
      middlewareMode: true,
    },
    plugins: [vue()],
  });
  return server;
}
