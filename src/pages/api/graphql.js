// GraphQL endpoint configuration
const GRAPHQL_ENDPOINT = "https://horizon-api.www.coggles.com/graphql";

export async function POST({ request, locals }) {
  let response;
  const runtime = locals.runtime;
  let headers = new Headers(request.headers);

  let submitHeaders = headers;

  if (import.meta.env.DEV) {
    submitHeaders = {
      cookie: request.headers.get("cookie"),
      "user-agent": request.headers.get("user-agent"),
    };
  }

  try {
    const clientIp = request.headers.get("fastly-client-ip"); //TEMPORARY
    let newRequest = request.clone();
    headers.set("X-Horizon-Client", "altitude-commerce-docs");

    const init = {
      headers: import.meta.env.DEV
        ? {
            ...submitHeaders,
            "X-Trusted-Client-Ip": clientIp,
            "X-Trust-Client-Ip-Key":
              runtime.env.HORIZON_KEY_TO_TRUST_PROVIDED_CLIENT_IP,
          }
        : {
            ...Object.fromEntries(submitHeaders.entries()),
            "X-Trusted-Client-Ip": clientIp,
            "X-Trust-Client-Ip-Key":
              runtime.env.HORIZON_KEY_TO_TRUST_PROVIDED_CLIENT_IP,
          },
      method: newRequest.method,
      body: newRequest.body,
      duplex: "half",
    };

    response = await fetch(GRAPHQL_ENDPOINT, init);

    const responseHeaders = new Headers(response.headers);

    if (import.meta.env.DEV) {
      responseHeaders.delete("content-encoding");
      responseHeaders.delete("content-length");
    }
    response = new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });

    return response;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    return new Response(
      JSON.stringify({
        errors: [{ message: "Failed to process GraphQL request" }],
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
