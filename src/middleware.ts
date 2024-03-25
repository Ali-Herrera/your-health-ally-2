import { authMiddleware } from '@clerk/nextjs';

// Routes that can be accessed while signed in
// const signedInRoutes = ["/chat"];

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    '/sign-in',
    '/',
    '/sign-up',
    '/api/trpc/ai.generateText',
    '/api/trpc/ai.reset',
  ],

  // Routes that can always be accessed, and have
  // no authentication information
  // ignoredRoutes: ['/no-auth-in-this-route', '/trpc/ai.generateText'],
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
