import React, { useEffect, useState } from "react";

interface FeatureSupport {
  [browser: string]: string;
}

interface FeatureData {
  name: string;
  slug: string;
  mdnUrl?: string;
  support: FeatureSupport;
  usage: number;
  status?: string;
  fallback?: FeatureSupport;
  fallbackDescription?: string;
}

interface BrowserCompatibilityTableProps {
  features: Array<{
    name: string;
    slug: string;
    mdnUrl?: string;
    fallback?: {
      description: string;
      browsers: {
        chrome?: string;
        firefox?: string;
        safari?: string;
        edge?: string;
        chrome_android?: string;
        ios_safari?: string;
        samsung?: string;
      };
    };
  }>;
  showFallbacks?: boolean;
}

const browserDisplayNames: { [key: string]: string } = {
  chrome: "Chrome",
  firefox: "Firefox",
  safari: "Safari",
  edge: "Edge",
  chrome_android: "Chrome Mobile",
  ios_safari: "Safari iOS",
  samsung: "Samsung Internet",
};

const browserOrder = [
  "chrome",
  "firefox",
  "safari",
  "edge",
  "chrome_android",
  "ios_safari",
  "samsung",
];

function getVersionFromStats(stats: any): string {
  if (!stats) return "N/A";

  // Find the earliest version with support (y or a)
  const versions = Object.keys(stats).sort((a, b) => {
    const numA = parseFloat(a.split("-")[0]);
    const numB = parseFloat(b.split("-")[0]);
    return numA - numB;
  });

  for (const version of versions) {
    if (
      stats[version] === "y" ||
      stats[version]?.includes("y") ||
      stats[version] === "a" ||
      stats[version]?.includes("a")
    ) {
      return version.split("-")[0] + "+";
    }
  }

  return "Not supported";
}

function calculateUsagePercentage(data: any): number {
  if (!data?.stats) return 0;

  let totalUsage = 0;

  for (const browser in data.stats) {
    for (const version in data.stats[browser]) {
      const support = data.stats[browser][version];
      const usage = data.usage_perc_y || 0;

      if (
        support === "y" ||
        support?.includes("y") ||
        support === "a" ||
        support?.includes("a")
      ) {
        // This is a simplified calculation
        // In reality, you'd need browser usage data per version
        totalUsage = Math.max(totalUsage, usage);
      }
    }
  }

  return data.usage_perc_y || totalUsage;
}

function getBaselineStatus(slug: string): string {
  // These are approximations based on when features became widely available
  const baselineYears: { [key: string]: string } = {
    "custom-elementsv1": "Baseline 2020",
    beacon: "Baseline 2018",
    fetch: "Baseline 2017",
  };

  return baselineYears[slug] || "";
}

function getFallbackStatus(feature: string): string {
  // Status for fallback implementations
  if (feature === "custom-elementsv1") {
    return "Universal"; // DOM APIs are universally available
  } else if (feature === "beacon") {
    return "Baseline 2017"; // fetch with keepalive
  }
  return "";
}

function getFallbackUsage(feature: string): number {
  // Calculate usage based on fallback support
  if (feature === "custom-elementsv1") {
    return 99.9; // Basic DOM APIs work almost everywhere
  } else if (feature === "beacon") {
    return 97.5; // fetch with keepalive has very good support
  }
  return 100;
}

function getStaticSupport(slug: string): FeatureSupport {
  // Static fallback data based on our research
  const staticData: { [key: string]: FeatureSupport } = {
    "custom-elementsv1": {
      chrome: "67+",
      firefox: "63+",
      safari: "10.1+",
      edge: "79+",
      chrome_android: "67+",
      ios_safari: "10.3+",
      samsung: "6.2+",
    },
    beacon: {
      chrome: "39+",
      firefox: "31+",
      safari: "11.1+",
      edge: "14+",
      chrome_android: "39+",
      ios_safari: "11.3+",
      samsung: "4.0+",
    },
  };

  return (
    staticData[slug] || {
      chrome: "Unknown",
      firefox: "Unknown",
      safari: "Unknown",
      edge: "Unknown",
      chrome_android: "Unknown",
      ios_safari: "Unknown",
      samsung: "Unknown",
    }
  );
}

export default function BrowserCompatibilityTable({
  features = [],
  showFallbacks = true,
}: BrowserCompatibilityTableProps) {
  const [featureData, setFeatureData] = useState<FeatureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minimumVersions, setMinimumVersions] = useState<FeatureSupport>({});
  const [worstCaseStatus, setWorstCaseStatus] = useState<string>("");
  const [worstCaseUsage, setWorstCaseUsage] = useState<number>(100);

  useEffect(() => {
    const fetchFeatureData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate features prop
        if (!features || !Array.isArray(features)) {
          console.error("Invalid features prop:", features);
          throw new Error("Features must be an array");
        }

        console.log(
          "Starting to fetch feature data for:",
          features.map((f) => f.slug)
        );

        const fetchedData: FeatureData[] = [];

        for (const feature of features) {
          try {
            console.log(`Fetching data for ${feature.slug}...`);
            const response = await fetch(
              `https://raw.githubusercontent.com/Fyrd/caniuse/main/features-json/${feature.slug}.json`,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                },
              }
            );

            if (!response.ok) {
              console.error(
                `Failed to fetch ${feature.slug}: ${response.status} ${response.statusText}`
              );
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Successfully fetched data for ${feature.slug}`);

            const support: FeatureSupport = {};
            for (const browser of browserOrder) {
              support[browser] = getVersionFromStats(data.stats[browser]);
            }

            const usage = calculateUsagePercentage(data);
            const status = getBaselineStatus(feature.slug);

            const featureInfo: FeatureData = {
              name: feature.name,
              slug: feature.slug,
              mdnUrl: feature.mdnUrl,
              support,
              usage,
              status,
            };

            // Add fallback data if provided
            if (feature.fallback && showFallbacks) {
              featureInfo.fallback = {};
              featureInfo.fallbackDescription = feature.fallback.description;

              for (const browser of browserOrder) {
                const fallbackVersion =
                  feature.fallback.browsers[
                    browser as keyof typeof feature.fallback.browsers
                  ];
                if (fallbackVersion) {
                  featureInfo.fallback[browser] = fallbackVersion;
                }
              }
            }

            fetchedData.push(featureInfo);
          } catch (err) {
            console.error(`Error fetching ${feature.slug}:`, err);
            // Add a fallback with static data
            const fallbackInfo: FeatureData = {
              name: feature.name,
              slug: feature.slug,
              mdnUrl: feature.mdnUrl,
              support: getStaticSupport(feature.slug),
              usage: 95.0, // Default high usage
              status: getBaselineStatus(feature.slug),
              fallback: feature.fallback ? {} : undefined,
              fallbackDescription: feature.fallback?.description,
            };

            if (feature.fallback) {
              for (const browser of browserOrder) {
                const fallbackVersion =
                  feature.fallback.browsers[
                    browser as keyof typeof feature.fallback.browsers
                  ];
                if (fallbackVersion) {
                  fallbackInfo.fallback![browser] = fallbackVersion;
                }
              }
            }

            fetchedData.push(fallbackInfo);
          }
        }

        if (fetchedData.length === 0) {
          throw new Error("No feature data could be loaded");
        }

        // Calculate minimum required versions
        const minVersions: FeatureSupport = {};
        for (const browser of browserOrder) {
          let maxVersion = 0;
          let maxVersionStr = "";

          for (const feature of fetchedData) {
            // Check fallback support first (as it's the actual minimum)
            const fallbackVersion = feature.fallback?.[browser];
            const fallbackNum = parseFloat(
              fallbackVersion?.replace("+", "") || "999"
            );

            // Check native support
            const nativeVersion = feature.support[browser];
            const nativeNum = parseFloat(
              nativeVersion?.replace("+", "") || "999"
            );

            // Use the lower of the two (fallback or native) as the effective minimum
            const effectiveVersion = Math.min(fallbackNum, nativeNum);
            const effectiveVersionStr =
              effectiveVersion === fallbackNum
                ? fallbackVersion
                : nativeVersion;

            // Track the highest minimum across all features
            if (effectiveVersion < 999 && effectiveVersion > maxVersion) {
              maxVersion = effectiveVersion;
              maxVersionStr = effectiveVersionStr || "";
            }
          }

          minVersions[browser] = maxVersionStr || "N/A";
        }
        
        // Calculate worst-case status and usage across all features
        let worstCaseStatus = "";
        let worstCaseUsage = 100;
        
        for (const feature of fetchedData) {
          // For each feature, determine the effective usage (with fallback if available)
          let effectiveUsage = feature.usage;
          
          if (feature.fallback) {
            // When there's a fallback, use the fallback's usage as it represents the minimum support
            const fallbackUsage = getFallbackUsage(feature.slug);
            effectiveUsage = fallbackUsage;
          }
          
          // Track the minimum usage across all features
          if (effectiveUsage < worstCaseUsage) {
            worstCaseUsage = effectiveUsage;
          }
          
          // For status: consider both native and fallback, pick the earliest baseline
          const fallbackStatus = feature.fallback ? getFallbackStatus(feature.slug) : "";
          
          // Determine the effective status (fallback takes precedence if it exists and is earlier)
          let effectiveStatus = feature.status;
          if (fallbackStatus && fallbackStatus !== "Universal") {
            if (!effectiveStatus) {
              effectiveStatus = fallbackStatus;
            } else {
              const nativeYear = parseInt(feature.status.match(/\d{4}/)?.[0] || "9999");
              const fallbackYear = parseInt(fallbackStatus.match(/\d{4}/)?.[0] || "9999");
              if (fallbackYear < nativeYear) {
                effectiveStatus = fallbackStatus;
              }
            }
          }
          
          // Update worst-case status if this feature's effective status is earlier
          if (effectiveStatus && effectiveStatus !== "Universal") {
            if (!worstCaseStatus) {
              worstCaseStatus = effectiveStatus;
            } else {
              const currentYear = parseInt(worstCaseStatus.match(/\d{4}/)?.[0] || "9999");
              const newYear = parseInt(effectiveStatus.match(/\d{4}/)?.[0] || "9999");
              if (newYear < currentYear) {
                worstCaseStatus = effectiveStatus;
              }
            }
          }
        }

        setMinimumVersions(minVersions);
        setWorstCaseStatus(worstCaseStatus);
        setWorstCaseUsage(worstCaseUsage);
        setFeatureData(fetchedData);
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchFeatureData:", err);
        setError(
          `Failed to load browser compatibility data: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setLoading(false);

        // Use static data as ultimate fallback
        const staticData: FeatureData[] = features.map((feature) => ({
          name: feature.name,
          slug: feature.slug,
          mdnUrl: feature.mdnUrl,
          support: getStaticSupport(feature.slug),
          usage: 95.0,
          status: getBaselineStatus(feature.slug),
          fallback: feature.fallback ? {} : undefined,
          fallbackDescription: feature.fallback?.description,
        }));

        // Add fallback data
        staticData.forEach((data, index) => {
          const feature = features[index];
          if (feature.fallback && data.fallback) {
            for (const browser of browserOrder) {
              const fallbackVersion =
                feature.fallback.browsers[
                  browser as keyof typeof feature.fallback.browsers
                ];
              if (fallbackVersion) {
                data.fallback[browser] = fallbackVersion;
              }
            }
          }
        });

        setFeatureData(staticData);
      }
    };

    // Add a timeout for the fetch
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Fetch timeout - using static data");
        setError("Request timeout - using cached data");
        setLoading(false);
      }
    }, 5000);

    fetchFeatureData().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [features, showFallbacks]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading browser compatibility data...
      </div>
    );
  }

  if (error && featureData.length === 0) {
    return (
      <div style={{ padding: "2rem", color: "#d32f2f" }}>Error: {error}</div>
    );
  }

  return (
    <div className="browser-compatibility-table">
      {error && (
        <div
          style={{
            marginBottom: "1rem",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            color: "#ff9800",
            borderRadius: "4px",
            border: "1px solid rgba(255, 152, 0, 0.2)",
          }}
        >
          Note: Using cached data. Live data unavailable.
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 0,
            marginBottom: "1rem",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "transparent",
                borderBottom: "2px solid #555",
              }}
            >
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  color: "#b0b0b0",
                  fontWeight: "normal",
                }}
              >
                Feature
              </th>
              {browserOrder.map((browser) => (
                <th
                  key={browser}
                  style={{
                    padding: "0.75rem",
                    textAlign: "center",
                    color: "#b0b0b0",
                    fontWeight: "normal",
                    minWidth: "80px",
                  }}
                >
                  {browserDisplayNames[browser]}
                </th>
              ))}
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "center",
                  color: "#b0b0b0",
                  fontWeight: "normal",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "center",
                  color: "#b0b0b0",
                  fontWeight: "normal",
                }}
              >
                Usage
              </th>
            </tr>
          </thead>
          <tbody>
            {featureData.map((feature, idx) => (
              <React.Fragment key={feature.slug}>
                <tr style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "0.75rem", color: "#fff" }}>
                    <strong>
                      {feature.mdnUrl ? (
                        <a
                          href={feature.mdnUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          {feature.name}
                        </a>
                      ) : (
                        feature.name
                      )}
                    </strong>
                  </td>
                  {browserOrder.map((browser) => (
                    <td
                      key={browser}
                      style={{
                        padding: "0.75rem",
                        textAlign: "center",
                        color: "#e0e0e0",
                      }}
                    >
                      {feature.support[browser] || "N/A"}
                    </td>
                  ))}
                  <td style={{ padding: "0.75rem", textAlign: "center" }}>
                    {feature.status && (
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "0.85em",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(102, 187, 106, 0.2)",
                          color: "#66bb6a",
                          whiteSpace: "nowrap",
                          border: "1px solid rgba(76, 175, 80, 0.3)",
                        }}
                      >
                        {feature.status}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                      color: "#e0e0e0",
                    }}
                  >
                    {feature.usage > 0 ? `${feature.usage.toFixed(1)}%` : "-"}
                  </td>
                </tr>
                {feature.fallback &&
                  showFallbacks &&
                  Object.keys(feature.fallback).length > 0 && (
                    <tr
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        borderBottom: "1px solid #444",
                      }}
                    >
                      <td
                        style={{
                          padding: "0.75rem",
                          paddingLeft: "2rem",
                          fontSize: "0.9em",
                          color: "#a0a0a0",
                        }}
                      >
                        ↳ Fallback
                      </td>
                      {browserOrder.map((browser) => (
                        <td
                          key={browser}
                          style={{
                            padding: "0.75rem",
                            textAlign: "center",
                            fontSize: "0.9em",
                            color: "#a0a0a0",
                          }}
                        >
                          {feature.fallback![browser] || "-"}
                        </td>
                      ))}
                      <td style={{ padding: "0.75rem", textAlign: "center" }}>
                        {getFallbackStatus(feature.slug) && (
                          <span style={{ 
                            display: "inline-block",
                            fontSize: "0.75em",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            backgroundColor: "rgba(158, 158, 158, 0.15)",
                            color: "#9e9e9e",
                            whiteSpace: "nowrap",
                            border: "1px solid rgba(158, 158, 158, 0.25)"
                          }}>
                            {getFallbackStatus(feature.slug)}
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          textAlign: "center",
                          fontSize: "0.85em",
                          color: "#a0a0a0",
                        }}
                      >
                        {getFallbackUsage(feature.slug).toFixed(1)}%
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            ))}
            <tr
              style={{
                fontWeight: "bold",
                borderTop: "2px solid #666",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <td style={{ padding: "0.75rem", color: "#fff" }}>
                Minimum Required
              </td>
              {browserOrder.map((browser) => (
                <td
                  key={browser}
                  style={{
                    padding: "0.75rem",
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  {minimumVersions[browser] || "-"}
                </td>
              ))}
              <td style={{ padding: "0.75rem", textAlign: "center" }}>
                {worstCaseStatus && (
                  <span style={{ 
                    display: "inline-block",
                    fontSize: "0.85em",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(255, 193, 7, 0.15)",
                    color: "#ffc107",
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(255, 193, 7, 0.25)"
                  }}>
                    {worstCaseStatus}
                  </span>
                )}
              </td>
              <td style={{ padding: "0.75rem", textAlign: "center", color: "#fff" }}>
                {worstCaseUsage < 100 ? `${worstCaseUsage.toFixed(1)}%` : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
