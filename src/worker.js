import { onRequestPost as waitlistPost, onRequestOptions as waitlistOptions } from '../functions/api/waitlist.js';
import { onRequestPost as authPost, onRequestOptions as authOptions } from '../functions/api/auth.js';
import { handlePlaces } from '../functions/api/places.js';

function getAllowedOrigin(request) {
  var origin = request.headers.get('Origin');
  var requestOrigin = new URL(request.url).origin;
  if (!origin) return requestOrigin;
  if (origin === requestOrigin) return origin;
  var allowed = ['https://reupreport.com', 'https://www.reupreport.com'];
  if (allowed.includes(origin)) return origin;
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

    // Handle /api/maps-key — returns Maps JS API key for client-side map loader
    if (url.pathname === '/api/maps-key') {
      if (request.method === 'OPTIONS') {
        var mapsOrigin = getAllowedOrigin(request);
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': mapsOrigin || '',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Vary': 'Origin'
          }
        });
      }
      if (request.method === 'GET') {
        var keyOrigin = getAllowedOrigin(request);
        var mapsKey = env.GOOGLE_PLACES_API_KEY || '';
        return new Response(JSON.stringify({ key: mapsKey }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': keyOrigin || '',
            'Vary': 'Origin',
            'Cache-Control': 'no-store'
          }
        });
      }
      return new Response('Method not allowed', { status: 405 });
    }

    // Handle /api/places/*
    if (url.pathname.startsWith('/api/places')) {
      return handlePlaces(request, env);
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
