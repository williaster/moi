const isProd = process.env.NODE_ENV === 'production';

// transforms static asset urls with appropriate `/moi/`, depending on environment
// in prod `/static/images/hi.png` => `/moi/static/images/hi.png`
export default function getStaticUrl(url: string) {
  return isProd ? `/moi/${url}` : url;
}
