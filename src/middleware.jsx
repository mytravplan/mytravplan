// import { getToken } from 'next-auth/jwt';
// import { NextResponse } from 'next/server';

// export default async function middleware(request) {
//   const url = new URL(request.url);
//   const pathname = url.pathname;

//   // Get token from request
//   const token = await getToken({ req: request });
//   const user = token?.user;

//   // Define public routes
//   const adminPublicRoutes = ['/admin/login'];
//   const userPublicRoutes = ['/login'];

//   // Define private routes
//   const adminPrivateRoutes =
//     ['/admin/dashboard',
//       '/admin/activities',
//       '/admin/blog',
//       '/admin/bookings',
//       '/admin/cities',
//       '/admin/contacts',
//       '/admin/continents',
//       '/admin/countries',
//       '/admin/flights',
//       '/admin/footer',
//       '/admin/notifications',
//       '/admin/packages',
//       '/admin/profile',
//       '/admin/reports',
//       '/admin/settings',
//       '/admin/users',
//     ];
//   const userPrivateRoutes = ['/my-orders'];

//   // Redirect admin users who are trying to access user public routes
//   if (token && user.role === 'admin' && userPublicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//   }

//   // Redirect regular users who are trying to access user public routes
//   if (token && user.role === 'user' && userPublicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL(request.headers.get('referer') || '/', request.url));

//   }

//   // Redirect users with role 'user' who are trying to access admin routes, except '/admin/login'
//   if (token && user.role === 'user' && pathname.startsWith('/admin') && !adminPublicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // Redirect unauthenticated users trying to access private user routes
//   if (!token && userPrivateRoutes.includes(pathname) && user.role === 'user') {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // Redirect admin cant excess the user dashboard
//   if (token && user.role === 'admin' && userPrivateRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL(request.headers.get('referer') || '/admin/dashboard', request.url));
//   }

//   // Redirect unauthenticated users trying to access admin routes
//   if (!token && pathname.startsWith('/admin') && adminPublicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL('/admin/login', request.url));
//   }

 
//   // Proceed with request if no redirects
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/admin/dashboard',
//     '/admin/activities',
//     '/admin/blog',
//     '/admin/bookings',
//     '/admin/cities',
//     '/admin/contacts',
//     '/admin/continents',
//     '/admin/countries',
//     '/admin/flights',
//     '/admin/footer',
//     '/admin/notifications',
//     '/admin/packages',
//     '/admin/profile',
//     '/admin/reports',
//     '/admin/settings',
//     '/admin/users',
//     '/admin/login',
//     '/my-orders',
//     '/login',
//   ],
// };



import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// Define admin route names for shortcuts
const adminRouteNames = [
  'dashboard',
  'activities',
  'blog',
  'bookings',
  'cities',
  'contacts',
  'continents',
  'countries',
  'flights',
  'footer',
  'notifications',
  'packages',
  'profile',
  'reports',
  'settings',
  'users',
];

// Generate full admin routes
const adminRoutes = adminRouteNames.map(route => `/admin/${route}`);
const userRoutes = ['/my-orders', '/login'];

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Get token from request
  const token = await getToken({ req: request });
  const user = token?.user;

  // Define public routes
  const adminPublicRoutes = ['/admin/login'];

  // Define private routes
  const adminPrivateRoutes = adminRoutes;

  // Redirect users (both logged in and logged out) trying to access admin private routes
  if (!token || (user && user.role !== 'admin' && adminPrivateRoutes.includes(pathname))) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirect admin users trying to access user public routes
  if (token && user.role === 'admin' && userRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Redirect regular users trying to access admin routes
  if (token && user.role === 'user' && pathname.startsWith('/admin') && !adminPublicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proceed with request if no redirects
  return NextResponse.next();
}

export const config = {
  matcher: [
    ...adminRoutes,
    ...userRoutes,
  ],
};
