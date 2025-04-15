import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('session');


  const isPublicFile = pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/api/');
  if (isPublicFile) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === '/auth/user/login';
  const isRegisterPage = pathname === '/auth/user/signup';

  if (sessionCookie && (isLoginPage||isRegisterPage)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!sessionCookie && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL('/auth/user/login', request.url));
  }

  return NextResponse.next();
}