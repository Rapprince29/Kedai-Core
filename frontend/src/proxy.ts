import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Redirect to login if visiting protected routes without token
  if (pathname.startsWith('/menu') || pathname.startsWith('/cart') || pathname.startsWith('/checkout') || pathname.startsWith('/admin') || pathname.startsWith('/cashier')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/menu', '/menu/:path*', 
    '/cart', '/cart/:path*', 
    '/checkout', '/checkout/:path*', 
    '/auth/:path*', 
    '/admin', '/admin/:path*', 
    '/cashier', '/cashier/:path*'
  ],
}
