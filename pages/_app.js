import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';

const publicPages = ['/'];

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
}

export default MyApp;