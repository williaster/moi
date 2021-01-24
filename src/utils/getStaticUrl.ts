import { basePath } from '../../basePath.js';

// transforms static asset urls with appropriate `basePath`,
// depending on dev vs prod environment. note: this doesn't
// apply to things handled by next e.g., bundles (see next.config.js)
export default function getStaticUrl(url: string) {
  return `${basePath}${url}`;
}
