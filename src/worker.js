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

      // GET = diagnostic check
      if (request.method === 'GET') {
        var hasKey = !!env.RESEND_API_KEY;
        var keyPreview = hasKey ? env.RESEND_API_KEY.slice(0, 8) + '...' : 'NOT SET';
        return new Response(JSON.stringify({
          status: 'Worker is running',
          resendKeyConfigured: hasKey,
          keyPreview: keyPreview,
          fromEmail: env.FROM_EMAIL || 'RE UP Report <hello@send.reupreport.com>'
        }, null, 2), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      return new Response('Method not allowed', { status: 405 });
    }

    // Let Cloudflare serve static assets for all other routes
    return env.ASSETS.fetch(request);
  }
};
