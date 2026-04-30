import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/menu') || pathname.startsWith('/cart') || pathname.startsWith('/checkout')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Redirect to menu if already logged in and visiting auth pages
  if (pathname.startsWith('/auth')) {
    if (token) {
      return NextResponse.redirect(new URL('/menu', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/menu/:path*', '/cart/:path*', '/checkout/:path*', '/auth/:path*'],
}
