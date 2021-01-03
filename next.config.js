const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  basePath: isProd ? '/moi' : '',
  // note: this doesn't apply to manually-set urls, e.g., for non-`next/image` images
  assetPrefix: isProd ? '/moi/' : '',
};
