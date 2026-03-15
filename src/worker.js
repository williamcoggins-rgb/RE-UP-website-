import { onRequestPost, onRequestOptions } from '../functions/api/waitlist.js';

var ALLOWED_ORIGINS = ['https://reupreport.com', 'https://www.reupreport.com'];

function getAllowedOrigin(request) {
  var origin = request.headers.get('Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    var url = new URL(request.url);

    // Handle /api/waitlist
    if (url.pathname === '/api/waitlist') {
      var context = { request: request, env: env, ctx: ctx };

      if (request.method === 'OPTIONS') {
        return onRequestOptions(context);
      }
      if (request.method === 'POST') {
        return onRequestPost(context);
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
