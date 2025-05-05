import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  // If the user is trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the token
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

      // Make sure token is a string
      const tokenString = String(token);

      const { payload } = await jwtVerify(
        tokenString,
        new TextEncoder().encode(JWT_SECRET)
      );

      // Check if user is admin
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
