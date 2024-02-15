import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from "@/components/ui/button";
import CreateSSOConnection from "@/components/create-sso-connection";
import { Organization } from 'stytch';
import { client } from '@/lib/stytch-client';
import Link from "next/link";

export default async function SSOConnections({
    organization, jwt
}: { organization: Organization, jwt: string }) {
    const { saml_connections } = await client.sso.getConnections(
        {
          organization_id: organization.organization_id,
        },
      );
    return (
        <Card className="w-full max-w-sm">
        <CardHeader className="pb-4">
          <CardTitle>SAML SSO Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pb-2">
            {saml_connections.map((connection) => {
              return (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  key={connection.connection_id}
                  asChild
                >
                  <Link
                    href={`/${organization.organization_slug}/dashboard/${connection.connection_id}/`}
                  >
                    {connection.display_name} ({connection.status})
                  </Link>
                </Button>
              );
            })}
            {saml_connections.length === 0 && (
              <span className="text-gray-500 w-full text-center flex justify-center items-center py-2">
                No connections configured
              </span>
            )}
          </div>
          <Separator className="mb-4" />
            <CreateSSOConnection organization_slug={organization.organization_slug} />
        </CardContent>

      </Card>
    )
}
