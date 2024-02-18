import { NextApiRequest } from 'next';

import { PrismaClient } from '@prisma/client'
import { authenticate } from '@/lib/stytch-client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextApiRequest, { params }: { params: { id: string }}) {
    const { organization } = await authenticate();
    const post = await prisma.post.findUnique({
        where: {
            id: Number(params.id),
            organization: organization.organization_id
        }
    })
    if(!post) return Response.json({ success: false, message: 'Post not found' }, { status: 404 });
    console.log(post);
    return Response.json({ success: true, post });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string }}) {
    const { organization } = await authenticate();
    const data: { title: string, content: string } = await request.json();
    
        const post = await prisma.post.update({
            where: {
                id: Number(params.id),
                organization: organization.organization_id
            },
            data: {
                title: data.title,
                content: data.content,
            }
        });

        return Response.json({ success: true, post });
}

export async function DELETE(request: NextApiRequest, { params }: { params: { id: string }}) {
    const { organization } = await authenticate();
    const post = await prisma.post.delete({
        where: {
            id: Number(params.id),
            organization: organization.organization_id
        }
    });
    return Response.json({ success: true, post });
}