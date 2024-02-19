import { PrismaClient } from '@prisma/client'
import { authorize } from '@/lib/stytch-client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const organization_id = request.nextUrl.searchParams.get("organization_id");

    if(!organization_id) return Response.json({ success: false, message: 'Organization ID is required' }, { status: 400 });
    console.log(organization_id);
    const { authorized } = await authorize({
        organization_id,
        resource_id: 'post',
        action: 'read',
    });

    if(!authorized) return Response.json({ success: false, message: 'Unauthorized' }, { status: 403 });

    const posts = await prisma.post.findMany({
        where: {
            organization: organization_id
        }
    })
    return Response.json({ success: true, posts });
}

export async function POST(request: NextRequest) {
    const data: { title: string, content: string, organization_id: string } = await request.json();
    const { member, organization, authorized } = await authorize({
        organization_id: data.organization_id,
        resource_id: 'post',
        action: 'create',
    });

    if(!authorized || !member || !organization) return Response.json({ success: false, message: 'Unauthorized' }, { status: 403 });

    const post = await prisma.post.create({
        data: {
            title: data.title,
            content: data.content,
            authorEmail: member.email_address,
            organization: organization.organization_id
        }
    });

    return Response.json({ success: true, post });
}