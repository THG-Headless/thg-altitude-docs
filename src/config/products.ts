export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  status: 'live' | 'beta' | 'alpha' | 'q2';
  quickLinks: {
    title: string;
    href: string;
  }[];
}

export const products: Record<string, Product> = {
  platform: {
    id: "platform",
    name: "Altitude Platform",
    description: "Deploy to a V8 edge environment in minutes",
    icon: "/statics/icons/altitude-alt.svg",
    href: "/products/platform",
    status: "live",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/platform"
      },
      {
        title: "Documentation",
        href: "/docs/platform"
      },
      {
        title: "Changelog",
        href: "/docs/platform/changelog"
      }
    ]
  },
  "browser-components": {
    id: "browser-components",
    name: "Browser Components",
    description: "Browser native UI components that are accessible and highly performant",
    icon: "/statics/icons/altitude.svg",
    href: "/products/browser-components",
    status: "beta",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/browser-components"
      },
      {
        title: "Documentation",
        href: "/docs/browser-components"
      }
    ]
  },
  "custom-components": {
    id: "custom-components",
    name: "Custom Components",
    description: "Directory of opinionated web components for building modern interfaces",
    icon: "/statics/icons/altitude.svg",
    href: "/products/custom-components",
    status: "q2",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/custom-components"
      },
      {
        title: "Documentation",
        href: "/docs/custom-components"
      }
    ]
  },
  "elements": {
    id: "elements",
    name: "Elements",
    description: "Installable commerce features to enhance your online store",
    icon: "/statics/icons/altitude.svg",
    href: "/products/elements",
    status: "beta",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/elements"
      },
      {
        title: "Documentation",
        href: "/docs/elements"
      }
    ]
  },
  "starter-kits": {
    id: "starter-kits",
    name: "Starter Kits",
    description: "Commerce accelerants to jumpstart your development",
    icon: "/statics/icons/altitude.svg",
    href: "/products/kits",
    status: "alpha",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/kits"
      },
      {
        title: "Documentation",
        href: "/docs/kits"
      }
    ]
  },
  "astro-integration": {
    id: "astro-integration",
    name: "Astro Integration",
    description: "i18N, Commerce API, and Blog API abstractions for Astro projects",
    icon: "/statics/icons/altitude.svg",
    href: "/products/astro-integration",
    status: "live",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/astro-integration"
      },
      {
        title: "Documentation",
        href: "/docs/astro-integration"
      }, 
      {
        title: "Changelog",
        href: "/docs/astro-integration/changelog"
      }
    ]
  },
  "astro-adapter": {
    id: "astro-adapter",
    name: "Astro Adapter",
    description: "Astro to Altitude worker adapter for seamless deployment",
    icon: "/statics/icons/altitude.svg",
    href: "/products/astro-adapter",
    status: "beta",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/astro-adapter"
      },
      {
        title: "Documentation",
        href: "/docs/astro-adapter"
      }
    ]
  },
  "cli": {
    id: "cli",
    name: "Altitude CLI",
    description: "Environment management tools with component commands",
    icon: "/statics/icons/altitude.svg",
    href: "/products/cli",
    status: "live",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/cli"
      },
      {
        title: "Documentation",
        href: "/docs/cli"
      }
    ]
  },
  "altitude-spark": {
    id: "altitude-spark",
    name: "Altitude Spark",
    description: "Prompt to UI to deployment interface with LLM capabilities",
    icon: "/statics/icons/altitude.svg",
    href: "/products/spark",
    status: "q2",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/altitude-spark"
      },
      {
        title: "Documentation",
        href: "/docs/altitude-spark"
      }
    ]
  },
  "captcha":{
    id: "captcha",
    name: "Captcha",
    description: "Captcha abstractions for simplified integration",
    icon: "/statics/icons/altitude.svg",
    href: "/products/captcha",
    status: "beta",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/captcha"
      },
      {
        title: "Documentation",
        href: "/docs/captcha"
      }
    ]
  },
  "insights": {
    id: "insights",
    name: "Insights",
    description: "Analytics and event tracking library for comprehensive user behavior monitoring",
    icon: "/statics/icons/insights.svg",
    href: "/products/insights",
    status: "beta",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/insights"
      },
      {
        title: "Documentation",
        href: "/docs/insights"
      }
    ]
  }
};

export function getProduct(id: string): Product {
  const product = products[id];
  if (!product) {
    throw new Error(`Product ${id} not found`);
  }
  return product;
}

export function getProducts() {
  return Object.values(products)
}