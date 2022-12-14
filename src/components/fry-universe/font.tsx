export const threeFontProps = {
  letterSpacing: -0.05,
  lineHeight: 0.8,
  // needs to be .woff
  font:
    'https://fonts.gstatic.com/s/spacegrotesk/v6/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj42VnskPMY.woff',
  // font: 'https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACH55Q3g.woff',
  // font: 'https://fonts.gstatic.com/s/hind/v11/5aU19_a8oxmIfLZcERySiw.woff',
  // font: 'https://fonts.gstatic.com/s/ibmplexmono/v7/-F6qfjptAgt5VM-kVkqdyU8n3vAOwlBFhA.woff',
  color: '#222',
  fontSize: 1,
  anchorX: 'center',
  anchorY: 'middle',
} as const;

export const cssFontRules = `
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
`;

export const FontUriLinks = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com"></link>
    <link rel="preconnect" href="https://fonts.gstatic.com"></link>
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap"
      rel="stylesheet"
    ></link>
    {/* <link rel="preconnect" href="https://fonts.googleapis.com"></link>
    <link rel="preconnect" href="https://fonts.gstatic.com"></link>
    <link
      href="https://fonts.googleapis.com/css2?family=Bangers&display=swap"
      rel="stylesheet"
    ></link> */}
    {/* <link rel="preconnect" href="https://fonts.googleapis.com"></link>
    <link rel="preconnect" href="https://fonts.gstatic.com"></link>
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;500;700&display=swap"
      rel="stylesheet"
    ></link> */}
  </>
);
