import { NextRequest } from "next/server";
import { authenticate, client } from "@/lib/stytch-client";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { organization, jwt } = await authenticate();

    try {
        await client.magicLinks.email.invite(
            {
                organization_id: organization.organization_id,
                email_address: body.email
            }
        )
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ success: false }, { status: 400 });
    }
}