import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get user data from cookies
  const userCookie = request.cookies.get('user')?.value
  const authToken = request.cookies.get('authToken')?.value
  
  // Parse user data
  let user = null
  if (userCookie && authToken) {
    try {
      user = JSON.parse(userCookie)
    } catch (error) {
      console.error('Error parsing user cookie:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Check if accessing company routes
  if (request.nextUrl.pathname.startsWith('/company')) {
    if (!user || !authToken || (user.role !== 'rental-company' && user.role !== 'admin')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || !authToken || user.role !== 'admin') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/company/:path*',
    '/admin/:path*'
  ]
}