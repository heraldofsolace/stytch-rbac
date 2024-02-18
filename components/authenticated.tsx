'use client';
import {
  useStytchB2BClient,
  useStytchMember,
  useStytchMemberSession,
} from '@stytch/nextjs/b2b';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function Authenticated({ children }: { children: ReactNode }) {
  const { member, isInitialized: memberIsInitiated } = useStytchMember();
  const { session, isInitialized: sessionIsInitiated } =
    useStytchMemberSession();
  const stytch = useStytchB2BClient();
  const router = useRouter();
  const authenticated = Boolean(member && session);
  const logout = async () => {
    await stytch.session.revoke();
    router.push(`/login`);
  };

  useEffect(() => {
    if (memberIsInitiated && sessionIsInitiated && !authenticated) {
      router.push(`/login`);
    }
  }, [authenticated, memberIsInitiated, sessionIsInitiated]);

  if (!memberIsInitiated || !sessionIsInitiated) return;

  return authenticated ? (
    <>
      {children}
      <Button variant="ghost" onClick={logout} size="sm" className="mt-4">
        Logout
      </Button>
    </>
  ) : null;
}
