'use client';
import { StytchB2BProvider } from '@stytch/nextjs/b2b';
import { createStytchB2BUIClient } from '@stytch/nextjs/b2b/ui';
import React from 'react';

const stytchClient = createStytchB2BUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || '',
);
export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <StytchB2BProvider stytch={stytchClient}>{children}</StytchB2BProvider>
  );
}