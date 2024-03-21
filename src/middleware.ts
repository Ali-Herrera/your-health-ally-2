import { authMiddleware, withClerkMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware

export default withClerkMiddleware(() => {
  console.log('middleware running');
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)'],
};
