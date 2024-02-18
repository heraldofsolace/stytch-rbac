import formidable from 'formidable';

import { PrismaClient } from '@prisma/client'
import { authenticate } from '@/lib/stytch-client';
import { NextRequest } from 'next/server';
import { NextApiRequest } from 'next';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const { organization } = await authenticate();
    const posts = await prisma.post.findMany({
        where: {
            organization: organization.organization_id
        }
    })
    return Response.json({ success: true, posts });
}

export async function POST(request: NextRequest) {
    const {  member, organization } = await authenticate();
    const data: { title: string, content: string } = await request.json();
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