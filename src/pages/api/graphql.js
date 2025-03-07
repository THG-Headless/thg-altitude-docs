import axios from 'axios'

// GraphQL endpoint configuration
const GRAPHQL_ENDPOINT = "https://horizon-api.www.coggles.com/graphql";

export async function POST({ request, locals }) {
  let response;
  const runtime = locals.runtime;

  try {
    if (import.meta.env.DEV) {
      const data = await request.json();
      response = await axios({
        method: 'post',
        url: GRAPHQL_ENDPOINT,
        data,
        headers: {
          cookie: request.headers.get('cookie'),
          'user-agent': request.headers.get('user-agent')
        }
      });

      response = new Response(JSON.stringify(response.data), response);
    } else {
      const clientIp = request.headers.get('fastly-client-ip'); //TEMPORARY
      let newRequest = request.clone();
      let headers = new Headers(newRequest.headers);
      headers.set('X-Horizon-Client', 'altitude-commerce-docs');

      const init = {
        headers: {
          ...Object.fromEntries(headers),
          'X-Trusted-Client-Ip': clientIp,
          'X-Trust-Client-Ip-Key': runtime.env.HORIZON_KEY_TO_TRUST_PROVIDED_CLIENT_IP
        },
        method: newRequest.method,
        body: newRequest.body
      };
      response = await fetch(GRAPHQL_ENDPOINT, init);
      response = new Response(response.body, response);
    }
    
    return response;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    return new Response(
      JSON.stringify({ 
        errors: [{ message: 'Failed to process GraphQL request' }] 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
