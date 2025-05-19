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
      // Define both the new and old JWT secrets for backward compatibility
      const JWT_SECRET = process.env.JWT_SECRET || 'immiza-secure-jwt-secret-key-2023';
      const OLD_JWT_SECRET = 'your-production-key'; // The previous secret

      // Make sure token is a string
      const tokenString = String(token);

      // Try to verify with the current secret first
      let payload;
      try {
        const result = await jwtVerify(
          tokenString,
          new TextEncoder().encode(JWT_SECRET)
        );
        payload = result.payload;
      } catch (newSecretError) {
        // If that fails, try with the old secret
        try {
          const result = await jwtVerify(
            tokenString,
            new TextEncoder().encode(OLD_JWT_SECRET)
          );
          payload = result.payload;
          console.log('Token verified with old secret in middleware');
        } catch (oldSecretError) {
          // If both fail, throw the original error
          throw newSecretError;
        }
      }

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
