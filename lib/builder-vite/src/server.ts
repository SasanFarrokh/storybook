import { Server } from "http";
import path from 'path';
import { createServer, ViteDevServer } from "vite";
import type { Plugin } from 'vite';
import type { CLIOptions, LoadOptions } from "@storybook/core-common";
import { optimizeDeps } from './utils/optimizeDeps';
import { mockCoreJs } from './utils/mockCoreJs';

export async function createViteServer({ configDir, port, framework }: LoadOptions & CLIOptions, devServer: Server): Promise<ViteDevServer> {
  // Lazy-load the proper Vite plugins, depending on which framework we use
  const plugins: Plugin[] = [mockCoreJs()];
  if (framework === 'vue') {
    const vuePlugin = await import('@vitejs/plugin-vue').then(plugin => plugin.default());
    plugins.push(vuePlugin);
  } else if (framework === 'react') {
    const reactPlugin = await import('@vitejs/plugin-react-refresh').then(plugin => plugin.default());
    plugins.push(reactPlugin);
  }

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
    plugins,
  });

  return server;
}
