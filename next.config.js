const { basePath } = require('./basePath');
const transpileModules = require('next-transpile-modules');

const withTM = transpileModules(['@react-three/drei', 'three', 'd3-time']);

module.exports = withTM({
  // note: these don't apply to manually-set urls, e.g., for non-`next/image` images
  basePath,
  assetPrefix: basePath,

  // handle react suspense for three loaders
  react: {
    useSuspense: true,
    wait: true,
  },
});
