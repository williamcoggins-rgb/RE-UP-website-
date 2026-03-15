import { onRequestPost, onRequestOptions } from '../functions/api/waitlist.js';

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

      return new Response('Method not allowed', { status: 405 });
    }

    // Let Cloudflare serve static assets for all other routes
    return env.ASSETS.fetch(request);
  }
};
