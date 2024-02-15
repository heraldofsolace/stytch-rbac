'use client';
import React, { useEffect, useState } from 'react';
import {
  StytchB2B,
  useStytchMember,
  useStytchMemberSession,
} from '@stytch/nextjs/b2b';
import {
  AuthFlowType,
  B2BAuthenticateResponse,
  B2BAuthenticateResponseWithMFA,
  B2BProducts,
  Callbacks,
  Organization,
  StyleConfig,
  StytchB2BUIConfig,
  StytchEventType,
} from '@stytch/vanilla-js';
import { useRouter } from 'next/navigation';

export default function Login(
  {
    authFlowType,
  }: {
    authFlowType?: 'discovery' | 'organization';
  } = { authFlowType: 'organization' },
) {
  const [config, setConfig] = useState<StytchB2BUIConfig | null>();
  const [authenticated, setAuthenticated] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const { member, isInitialized: memberIsInitiated } = useStytchMember();
  const { session, isInitialized: sessionIsInitiated } =
    useStytchMemberSession();
  const router = useRouter();
  const style: StyleConfig = {
    fontFamily: 'Arial',
  };
  const callbacks: Callbacks = {
    onEvent: async ({ type, data }) => {
      if (
        [
          StytchEventType.B2BDiscoveryIntermediateSessionExchange,
          StytchEventType.B2BDiscoveryOrganizationsCreate,
          StytchEventType.B2BMagicLinkAuthenticate,
          StytchEventType.B2BSSOAuthenticate,
        ].includes(type)
      ) {
        const organization = (
          data as B2BAuthenticateResponseWithMFA | B2BAuthenticateResponse
        ).organization;
        setAuthenticated(true);
        setOrganization(organization);
        router.push(`/${organization.organization_slug}/dashboard`);
      }
    },
  };

  useEffect(() => {
    setConfig({
      authFlowType:
        authFlowType === 'organization'
          ? AuthFlowType.Organization
          : AuthFlowType.Discovery,
      products: [
        ...(authFlowType === 'organization' ? [B2BProducts.sso] : []),
        B2BProducts.emailMagicLinks,
      ],
      sessionOptions: {
        sessionDurationMinutes: 60,
      },
    });
  }, []);
  useEffect(() => {
    setAuthenticated(Boolean(member && session));
  }, [member, session]);
  useEffect(() => {
    if (authenticated && organization) {
      router.push(`/${organization.organization_slug}/dashboard`);
    }
  }, [authenticated, organization]);

  if (!memberIsInitiated || !sessionIsInitiated) return;

  return config ? (
    <StytchB2B config={config} styles={style} callbacks={callbacks} />
  ) : null;
}
