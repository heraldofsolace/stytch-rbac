'use client';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import {  useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from './ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';

export default function InviteForm({
  organization_slug,
}: {
  organization_slug: string;
}) {
  const [emailAddress, setEmailAddress] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckedChange = (role: string) => (checked: CheckedState) => {
    if (checked) {
      setRoles([...roles, role]);
    } else {
      setRoles(roles.filter((r) => r !== role));
    }
  }

  return (
    <>
      <Label htmlFor="saml-display-name">Invite a new member</Label>
      <div className="flex gap-2 flex-col">
        <Input
          className="flex-1"
          id="saml-display-name"
          placeholder="Member email address"
          value={emailAddress}
          onInput={(e) => setEmailAddress(e.currentTarget.value)}
        />
        <div className='flex items-center'><Checkbox className='mr-4' onCheckedChange={handleCheckedChange('author')} /><Label>Author</Label></div>
        <div className='flex items-center'><Checkbox className='mr-4' onCheckedChange={handleCheckedChange('editor')}/><Label>Editor</Label></div>
        <div className='flex items-center'><Checkbox className='mr-4' onCheckedChange={handleCheckedChange('viewer')}/><Label>Viewer</Label></div>
        <Button
          disabled={loading || !emailAddress || roles.length === 0}
          onClick={async () => {
            setLoading(true);
        
            const response = await fetch('/api/invite', {
                method: 'POST',
                body: JSON.stringify({ email: emailAddress, roles }),
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
