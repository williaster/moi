const isProd = process.env.NODE_ENV === 'production';

// if prod is e.g., williaster.github.io/moi, this should be `/moi`
// if prod is e.g., chris-williams.me, this should be ``
module.exports = {
  basePath: isProd ? '' : '',
};
