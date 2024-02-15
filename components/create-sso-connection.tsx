'use client';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SAMLConnection } from '@stytch/vanilla-js';

export default function CreateSSOConnection({
  organization_slug,
}: {
  organization_slug: string;
}) {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <>
      <Label htmlFor="saml-display-name">Create a new SSO Connection</Label>
      <div className="flex gap-2">
        <Input
          className="flex-1"
          id="saml-display-name"
          placeholder="SAML Display Name"
          value={displayName}
          onInput={(e) => setDisplayName(e.currentTarget.value)}
        />
        <Button
          disabled={loading || !displayName}
          onClick={async () => {
            setLoading(true);
            try {
              const response = await fetch('/api/sso-connections', {
                method: 'POST',
                body: JSON.stringify({ display_name: displayName }),
              });
              const data: { connection: SAMLConnection } =
                await response.json();

              setLoading(false);
              router.push(
                `/${organization_slug}/dashboard/${data.connection.connection_id}`,
              );
            } catch (error) {
              alert('Error creating SAML connection');
              setLoading(false);
            }
          }}
        >
          Create
        </Button>
      </div>
    </>
  );
}
