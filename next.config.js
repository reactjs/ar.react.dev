/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  pageExtensions: ['jsx', 'js', 'ts', 'tsx', 'mdx', 'md'],
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    // React Compiler disabled due to known issue in Next.js 15.1.0
    // Issue: Compilation hangs when processing dynamic routes with MDX
    // Re-enable with Next.js +15.2 and use babel-plugin-react-compiler directly
    reactCompiler: false,
  },
  env: {},
  webpack: (config, {dev, isServer, ...options}) => {
    // Improve chunk loading reliability
    if (!isServer) {
      config.output = config.output || {};
      config.output.chunkLoadingGlobal = 'webpackChunkReactDev';
      config.output.publicPath = '/_next/';
    }

    if (process.env.ANALYZE) {
      const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: options.isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }

    // Don't bundle the shim unnecessarily.
    config.resolve.alias['use-sync-external-store/shim'] = 'react';

    // ESLint depends on the CommonJS version of esquery,
    // but Webpack loads the ESM version by default. This
    // alias ensures the correct version is used.
    //
    // More info:
    // https://github.com/reactjs/react.dev/pull/8115
    config.resolve.alias['esquery'] = 'esquery/dist/esquery.min.js';

    const {IgnorePlugin, NormalModuleReplacementPlugin} = require('webpack');
    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /^raf$/,
        require.resolve('./src/utils/rafShim.js')
      ),
      new NormalModuleReplacementPlugin(
        /^process$/,
        require.resolve('./src/utils/processShim.js')
      ),
      new IgnorePlugin({
        checkResource(resource, context) {
          if (
            /\/eslint\/lib\/rules$/.test(context) &&
            /\.\/[\w-]+(\.js)?$/.test(resource)
          ) {
            // Skips imports of built-in rules that ESLint
            // tries to carry into the bundle by default.
            // We only want the engine and the React rules.
            return true;
          }
          return false;
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
