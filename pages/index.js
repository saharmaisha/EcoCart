import { useAuth, SignInButton, SignOutButton } from '@clerk/nextjs';
import React from 'react';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <div>
        <div>
          <center>
            {isSignedIn ? (
              <>
                <p>Welcome! You are signed in.</p>
                <SignOutButton>
                  <button>Sign Out</button>
                </SignOutButton>
              </>
            ) : (
              <>
                <p>Please sign in to continue.</p>
                <SignInButton mode="modal">
                  <button>Sign In</button>
                </SignInButton>
              </>
            )}
          </center>
        </div>
      </div>
    </>
  );
}
