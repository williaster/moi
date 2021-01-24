const isProd = process.env.NODE_ENV === 'production';

// if prod is e.g., williaster.github.io/moi, this should be `/moi`
// if prod is e.g., chris-williams.me, this should be ``
const prodRootPath = '';

// transforms static asset urls with appropriate `prodRootPath`,
// depending on dev vs prod environment
// `/static/images/hi.png` => `${prodRootPath}/static/images/hi.png`
export default function getStaticUrl(url: string) {
  return isProd ? `${prodRootPath}${url}` : url;
}
