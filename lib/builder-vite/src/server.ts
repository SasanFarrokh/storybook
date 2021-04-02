import path from 'path';
import { createServer, ViteDevServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import type { LoadOptions } from '@storybook/core-common';
import { optimizeDeps } from './utils/optimizeDeps';
import { mockCoreJs } from './utils/mockCoreJs';

export async function createViteServer({ configDir }: LoadOptions): Promise<ViteDevServer> {
  const server = await createServer({
    configFile: false,
    root: path.resolve(configDir, '..'),
    server: {
      middlewareMode: true,
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
    optimizeDeps,
    plugins: [
      mockCoreJs(),
      vue(),
    ],
  });

  server.middlewares.use((req, res, next) => {
    if (req.url.startsWith('/core-js')) {
    }
    next();
  });
  return server;
}
