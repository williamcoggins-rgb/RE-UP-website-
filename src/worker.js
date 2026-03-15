import { onRequestPost as waitlistPost, onRequestOptions as waitlistOptions } from '../functions/api/waitlist.js';
import { onRequestPost as authPost, onRequestOptions as authOptions } from '../functions/api/auth.js';

var ALLOWED_ORIGINS = ['https://reupreport.com', 'https://www.reupreport.com'];

function getAllowedOrigin(request) {
  var origin = request.headers.get('Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  // Allow same-origin requests (workers.dev, custom domains, etc.)
  var requestUrl = new URL(request.url);
  if (origin && origin === requestUrl.origin) {
    return origin;
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    var url = new URL(request.url);
    var context = { request: request, env: env, ctx: ctx };

    // Handle /api/auth
    if (url.pathname === '/api/auth') {
      if (request.method === 'OPTIONS') {
        return authOptions(context);
      }
      if (request.method === 'POST') {
        return authPost(context);
      }
      return new Response('Method not allowed', { status: 405 });
    }

    // Handle /api/waitlist
    if (url.pathname === '/api/waitlist') {
      if (request.method === 'OPTIONS') {
        return waitlistOptions(context);
      }
      if (request.method === 'POST') {
        return waitlistPost(context);
      }

      // Health check — no sensitive info
      if (request.method === 'GET') {
        var origin = getAllowedOrigin(request);
        var headers = { 'Content-Type': 'application/json' };
        if (origin) {
          headers['Access-Control-Allow-Origin'] = origin;
          headers['Vary'] = 'Origin';
        }
        return new Response(JSON.stringify({ status: 'ok' }), { headers: headers });
      }

      return new Response('Method not allowed', { status: 405 });
    }

    // Let Cloudflare serve static assets for all other routes
    return env.ASSETS.fetch(request);
  }
};
