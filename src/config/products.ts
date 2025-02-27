export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'live' | 'beta' | 'alpha' | 'q2';
  quickLinks: {
    title: string;
    href: string;
  }[];
}

export const products: Record<string, Product> = {
  "browser-components": {
    id: "browser-components",
    name: "Browser Components",
    description: "Browser native UI components that are accessible and highly performant",
    icon: "/icons/altitude.svg",
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
    icon: "/icons/altitude.svg",
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
    icon: "/icons/altitude.svg",
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
    icon: "/icons/altitude.svg",
    status: "alpha",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/starter-kits"
      },
      {
        title: "Documentation",
        href: "/docs/starter-kits"
      }
    ]
  },
  "astro-integration": {
    id: "astro-integration",
    name: "Astro Integration",
    description: "i18N, Commerce API, and Blog API abstractions for Astro projects",
    icon: "/icons/altitude.svg",
    status: "live",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/astro-integration"
      },
      {
        title: "Documentation",
        href: "/docs/astro-integration"
      }
    ]
  },
  "astro-adapter": {
    id: "astro-adapter",
    name: "Astro Adapter",
    description: "Astro to Altitude worker adapter for seamless deployment",
    icon: "/icons/altitude.svg",
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
  "altitude-cli": {
    id: "altitude-cli",
    name: "Altitude CLI",
    description: "Environment management tools with component commands",
    icon: "/icons/altitude.svg",
    status: "live",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/altitude-cli"
      },
      {
        title: "Documentation",
        href: "/docs/altitude-cli"
      }
    ]
  },
  "altitude-v0": {
    id: "altitude-v0",
    name: "Altitude v0",
    description: "Prompt to UI to deployment interface with LLM capabilities",
    icon: "/icons/altitude.svg",
    status: "q2",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/altitude-v0"
      },
      {
        title: "Documentation",
        href: "/docs/altitude-v0"
      }
    ]
  },
  cloud: {
    id: "cloud",
    name: "Altitude Platform",
    description: "Deploy to a V8 edge environment in minutes",
    icon: "/icons/altitude-alt.svg",
    status: "live",
    quickLinks: [
      {
        title: "Overview",
        href: "/products/cloud"
      },
      {
        title: "Documentation",
        href: "/docs/cloud"
      },
      {
        title: "Changelog",
        href: "/docs/cloud/changelog"
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