const { basePath } = require('./src/basePath.ts');

module.exports = {
  // note: these don't apply to manually-set urls, e.g., for non-`next/image` images
  basePath,
  assetPrefix: basePath,
};
