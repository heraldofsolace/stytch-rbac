import Authenticated from '@/components/authenticated';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authenticate, client } from '@/lib/stytch-client';
import { redirect } from 'next/navigation';
import SSOConnectionForm from '@/components/sso-connection-form';

export default async function ConnectionPage({
  params,
}: {
  params: { slug: string; connection_id: string };
}) {
  const { organization, member } = await authenticate();
  const { saml_connections } = await client.sso.getConnections({
    organization_id: organization.organization_id,
  });
  const connection = saml_connections.find(
    (connection) => connection.connection_id === params.connection_id,
  );

  if (!connection) {
    return redirect(`/${params.slug}/dashboard`);
  }

  return (
    <Authenticated>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Edit SAML SSO Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <SSOConnectionForm
            canEdit={member.is_admin}
            connection={connection}
            backLink={`/${params.slug}/dashboard`}
          />
        </CardContent>

      </Card>
    </Authenticated>
  );
}
