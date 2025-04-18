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
  const isForgotPasswordPage = pathname === '/auth/user/login/forgot-password';
  const isResetPasswordPage = pathname === '/auth/user/login/reset-password';
  const isVerifyEmailPage = pathname === '/auth/user/signup/verify-email';

  if (sessionCookie && (isLoginPage||isRegisterPage|| isForgotPasswordPage || isResetPasswordPage || isVerifyEmailPage)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!sessionCookie && !isLoginPage && !isRegisterPage && !isForgotPasswordPage && !isResetPasswordPage && !isVerifyEmailPage) {

    return NextResponse.redirect(new URL('/auth/user/login', request.url));
  }

  return NextResponse.next();
}