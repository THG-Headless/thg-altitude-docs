import React from 'react';
import BrowserCompatibilityTable from './BrowserCompatibilityTable';

const browserFeatures = [
  {
    name: "Custom Elements V1",
    slug: "custom-elementsv1",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements",
    fallback: {
      description: "Uses standard DOM APIs available in all browsers",
      browsers: {
        chrome: "1+",
        firefox: "1+",
        safari: "3.1+",
        edge: "12+",
        chrome_android: "18+",
        ios_safari: "3.2+",
        samsung: "1.0+",
      },
    },
  },
  {
    name: "Beacon API",
    slug: "beacon",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon",
    fallback: {
      description: "Uses fetch() with keepalive flag for reliable data transmission",
      browsers: {
        chrome: "42+",
        firefox: "39+",
        safari: "10.1+",
        edge: "14+",
        chrome_android: "42+",
        ios_safari: "10.3+",
        samsung: "4.0+",
      },
    },
  },
];

export default function InsightsBrowserRequirements() {
  return <BrowserCompatibilityTable features={browserFeatures} showFallbacks={true} />;
}