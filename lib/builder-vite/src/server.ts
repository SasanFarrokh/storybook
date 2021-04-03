import { Server } from "http";
import path from 'path';
import { createServer, ViteDevServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import type { CLIOptions, LoadOptions } from "@storybook/core-common";
import { optimizeDeps } from './utils/optimizeDeps';
import { mockCoreJs } from './utils/mockCoreJs';

export async function createViteServer({ configDir, port }: LoadOptions & CLIOptions, devServer: Server): Promise<ViteDevServer> {
  const server = await createServer({
    configFile: false,
    root: path.resolve(configDir, '..'),
    server: {
      middlewareMode: true,
      hmr: {
        port,
        server: devServer,
      },
    },
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm-bundler.js',
      },
    },
    optimizeDeps,
    plugins: [mockCoreJs(), vue()],
  });

  return server;
}
