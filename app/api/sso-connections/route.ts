import { authenticate, client } from "@/lib/stytch-client";

export async function POST(request: Request) {
  const body = await request.json();
  const { organization, jwt } = await authenticate();
  const { connection } = await client.sso.saml.createConnection(
    {
      organization_id: organization.organization_id,
      display_name: body.display_name,
    },
  );

  if (connection) {
    await client.organizations.update(
      {
        organization_id: organization.organization_id,
        sso_jit_provisioning: "RESTRICTED",
        sso_default_connection_id: connection.connection_id,
        sso_jit_provisioning_allowed_connections: [
          ...organization.sso_jit_provisioning_allowed_connections,
          connection.connection_id,
        ],
      },
    );

    return Response.json({ connection });
  }

  return new Response("Server Error", { status: 500 });
}

export async function PUT(request: Request) {
    const body = await request.json();
    const { organization, jwt } = await authenticate();
    const { connection } = await client.sso.saml.updateConnection(
        {
        organization_id: organization.organization_id,
        ...body,
        },
    );

    return Response.json({ connection });
}
  