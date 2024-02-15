'use client';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InviteForm({
  organization_slug,
}: {
  organization_slug: string;
}) {
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <>
      <Label htmlFor="saml-display-name">Invite a new member</Label>
      <div className="flex gap-2">
        <Input
          className="flex-1"
          id="saml-display-name"
          placeholder="Member email address"
          value={emailAddress}
          onInput={(e) => setEmailAddress(e.currentTarget.value)}
        />
        <Button
          disabled={loading || !emailAddress}
          onClick={async () => {
            setLoading(true);
        
            const response = await fetch('/api/invite', {
                method: 'POST',
                body: JSON.stringify({ email: emailAddress }),
            });
            const data: { success: Boolean } = await response.json();

            setLoading(false);
            if(data.success)
                alert("Invited successfully");
            else
                alert('Error when inviting member');
            setEmailAddress('');
          }}
        >
          Invite
        </Button>
      </div>
    </>
  );
}
