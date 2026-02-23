// Vercel Edge Middleware — runs before static files are served
// Blocks access to course pages unless the user has a valid session cookie

export const config = {
  matcher: [
    '/pages/courses',
    '/pages/courses.html',
    '/pages/course-price-your-chair',
    '/pages/course-price-your-chair.html',
    '/pages/course-wealth-of-barbers',
    '/pages/course-wealth-of-barbers.html',
    '/pages/course-brand-blueprint',
    '/pages/course-brand-blueprint.html'
  ]
};

export default function middleware(request) {
  // Check for the session cookie set by the auth API
  var cookie = request.headers.get('cookie') || '';
  var hasSession = cookie.indexOf('reup_session=') !== -1;

  if (hasSession) {
    // User has a session cookie — let them through
    return;
  }

  // No session — redirect to membership page with return URL
  var url = new URL('/pages/membership.html', request.url);
  url.searchParams.set('redirect', new URL(request.url).pathname);
  return Response.redirect(url.toString(), 302);
}
