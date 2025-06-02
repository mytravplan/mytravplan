import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

 
  const token = await getToken({ req: request });
  const user = token?.user;

 
  const adminPublicRoutes = ['/admin/login'];
  const userPublicRoutes = ['/login'];

 
  const adminPrivateRoutes = ['/admin/dashboard'];
  const userPrivateRoutes = ['/my-orders'];
 
  if (token && user.role === 'admin' && userPublicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

 
  if (token && user.role === 'user' && userPublicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(request.headers.get('referer') || '/', request.url));

  }

 
  if (token && user.role === 'user' && pathname.startsWith('/admin') && !adminPublicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

 
  if (!token && userPrivateRoutes.includes(pathname)&&user.role==='user') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

 
  if (token && user.role === 'admin' && userPrivateRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(request.headers.get('referer') || '/admin/dashboard', request.url));
  }

 
  if (!token && pathname.startsWith('/admin') && !adminPublicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

 
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/my-orders',
    '/login',
  ],
};



 
 
 
 
// export function middleware(request) {
//   return NextResponse.redirect(new URL('/home', request.url))
// }
 
// export const config = {
//   matcher: '/about/:path*',
// }