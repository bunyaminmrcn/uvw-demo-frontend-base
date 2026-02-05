import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Cookie from 'js-cookie'

export default function middleware(request: NextRequest) {

  const token = request.cookies.get('token')?.value

  // Check if the user is trying to access a protected route
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/posts') || request.nextUrl.pathname.endsWith('/')) {
    if (!token) {
      // Redirect to login if there's no token
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Check if the user is trying to access login page while already authenticated
  if (request.nextUrl.pathname === '/auth/login') {
    if (token) {
      console.log("Here dashboard redirect")
      // Redirect to dashboard if there's a token
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  if (request.nextUrl.pathname === '/auth/logout') {
    if (token) {
      console.log("Remove token")
      request.cookies.delete('token');
      
      Cookie.remove('token', { path: '/', httpOnly: true , domain: 'localhost', secure: true, sameSite: 'strict'})
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    console.log("Here logout redirect")
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/posts/:path*', '/auth/login', '/'
  ]
}
