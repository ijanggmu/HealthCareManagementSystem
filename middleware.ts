import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios'; // Import Axios

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('X-Access-Token')?.value;
  // List of paths that don't require authentication
  const publicPaths = ['/login', '/register'];

  if (authToken) {
    const isValid = await validateToken(authToken);
    if (!isValid) {
      // If the token is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if ( !publicPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  
    // If the user is authenticated and tries to access login or register, redirect to home
    if ( publicPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Function to validate the token using Axios
async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate`, {
      token,
    });

    return response.status === 200; // Return true if the token is valid
  } catch (error) {
    return false; // Return false if there's an error
  }
}

// Apply middleware to all routes except API and static files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};