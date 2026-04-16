import React from 'react';
import BrowserCompatibilityTable from './BrowserCompatibilityTable';

const browserFeatures = [
  {
    name: "ES Modules",
    slug: "es6-module",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
    fallback: null,
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
  {
    name: "Intersection Observer",
    slug: "intersectionobserver",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API",
    fallback: {
      description: "Impression tracking via HTML attributes disabled; programmatic tracking still works",
      browsers: {
        chrome: "51+",
        firefox: "55+",
        safari: "12.1+",
        edge: "15+",
        chrome_android: "51+",
        ios_safari: "12.2+",
        samsung: "5.0+",
      },
    },
  },
  {
    name: "Fetch API",
    slug: "fetch",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
    fallback: null,
  },
  {
    name: "localStorage",
    slug: "namevalue-storage",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
    fallback: {
      description: "Falls back to in-memory storage for current session only",
      browsers: {
        chrome: "4+",
        firefox: "3.5+",
        safari: "4+",
        edge: "12+",
        chrome_android: "18+",
        ios_safari: "3.2+",
        samsung: "1.0+",
      },
    },
  },
];

export default function InsightsBrowserRequirements() {
  return <BrowserCompatibilityTable features={browserFeatures} showFallbacks={true} />;
}
