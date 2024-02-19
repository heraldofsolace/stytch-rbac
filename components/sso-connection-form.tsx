'use client';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import Link from 'next/link';
import type { SAMLConnection } from 'stytch';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SSOConnectionForm({
  connection,
  backLink,
  canEdit,
}: {
  connection: SAMLConnection;
  backLink: string;
  canEdit: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [roleAssignments, setRoleAssignments] = useState<{group: string, role_id: string}[]>(connection.saml_group_implicit_role_assignments || []);
  const router = useRouter();
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      await fetch('/api/sso-connections', {
        method: 'PUT',
        body: JSON.stringify({
          x509_certificate: formData.get('certificate') as string,
          connection_id: connection.connection_id,
          display_name: connection.display_name,
          attribute_mapping: {
            email: formData.get('email_attribute') as string,
            first_name: formData.get('first_name_attribute') as string,
            last_name: formData.get('last_name_attribute') as string,
            groups: formData.get('groups_attribute') as string,
          },
          idp_entity_id: formData.get('idp_entity_id') as string,
          idp_sso_url: formData.get('idp_sso_url') as string,
          saml_group_implicit_role_assignments: roleAssignments,
        }),
      });

      router.push(backLink);
    } catch (err) {
      setLoading(false);
      alert('Error updating SAML connection');
    }
  };
  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <div>
        <Label htmlFor="display_name">Display Name</Label>
        <Input
          type="text"
          id="display_name"
          name="display_name"
          value={connection.display_name}
          disabled
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Input
          type="text"
          id="status"
          name="status"
          disabled
          value={connection.status}
        />
      </div>
      <div>
        <Label htmlFor="acs_url">ACS URL</Label>
        <Input
          type="text"
          id="acs_url"
          name="acs_url"
          disabled
          value={connection.acs_url}
        />
      </div>
      <div>
        <Label htmlFor="audience_uri">Audience URI</Label>
        <Input
          type="text"
          id="audience_uri"
          name="audience_uri"
          disabled
          value={connection.audience_uri}
        />
      </div>
      <div>
        <Label htmlFor="idp_sso_url">SSO URL</Label>
        <Input
          type="text"
          id="idp_sso_url"
          name="idp_sso_url"
          placeholder="https://idp.com/sso/start"
          defaultValue={connection.idp_sso_url}
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label htmlFor="idp_entity_id">IDP Entity ID</Label>
        <Input
          type="text"
          id="idp_entity_id"
          name="idp_entity_id"
          placeholder="https://idp.com/sso/start"
          defaultValue={connection.idp_entity_id}
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label htmlFor="email_attribute">Email Attribute</Label>
        <Input
          type="text"
          id="email_attribute"
          name="email_attribute"
          placeholder="NameID"
          defaultValue={
            connection.attribute_mapping
              ? connection.attribute_mapping['email']
              : ''
          }
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label htmlFor="first_name_attribute">First Name Attribute</Label>
        <Input
          type="text"
          id="first_name_attribute"
          name="first_name_attribute"
          placeholder="firstName"
          defaultValue={
            connection.attribute_mapping
              ? connection.attribute_mapping['first_name']
              : ''
          }
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label htmlFor="last_name_attribute">Last Name Attribute</Label>
        <Input
          type="text"
          id="last_name_attribute"
          name="last_name_attribute"
          placeholder="lastName"
          defaultValue={
            connection.attribute_mapping
              ? connection.attribute_mapping['last_name']
              : ''
          }
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label htmlFor="groups_attribute">Groups Attribute</Label>
        <Input
          type="text"
          id="groups_attribute"
          name="groups_attribute"
          placeholder="groups"
          defaultValue={
            connection.attribute_mapping
              ? connection.attribute_mapping['groups']
              : ''
          }
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label>Role Assignments</Label>
        {roleAssignments.map((roleAssignment, index) => {
          return (
            <div className="flex gap-2 p-2">
              <Input
                type="text"
                id="group"
                name="group"
                placeholder="Group"
                value={roleAssignment.group}
                onInput={(e) => {
                  const newRoleAssignments = roleAssignments.map((r, i) => {
                    if (i === index) {
                      return { ...r, group: e.currentTarget.value };
                    }
                    return r;
                  });
                  setRoleAssignments(newRoleAssignments);
                }}
                disabled={!canEdit}
              />
              <Input
                type="text"
                id="role_id"
                name="role_id"
                placeholder="Role ID"
                value={roleAssignment.role_id}
                onInput={(e) => {
                  const newRoleAssignments = roleAssignments.map((r, i) => {
                    if (i === index) {
                      return { ...r, role_id: e.currentTarget.value };
                    }
                    return r;
                  });
                  setRoleAssignments(newRoleAssignments);
                }}
                disabled={!canEdit}
              />
           <Button onClick={(e) => {
            e.preventDefault();
            setRoleAssignments(roleAssignments.filter((_, i) => i !== index))}}>Remove</Button>
           </div>
          )
        })}
        <Button className='block m-4' onClick={(e) => {
          e.preventDefault();
          setRoleAssignments([...roleAssignments, { group: '', role_id: '' }])}}>Add role assignment</Button>
        
      </div>
      <div>
        <Label htmlFor="certificate">Signing Certificate</Label>
        <textarea
          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="certificate"
          name="certificate"
          placeholder="-----BEGIN CERTIFICATE-----"
          defaultValue={connection.verification_certificates[0]?.certificate}
          disabled={!canEdit}
        />
      </div>
      {canEdit && (
        <Button className="w-full" type="submit" disabled={loading}>
          Save
        </Button>
      )}
      <Button
        variant="outline"
        className="w-full"
        size="sm"
        asChild
        disabled={loading}
      >
        <Link href={backLink}>Back</Link>
      </Button>
    </form>
  );
}
