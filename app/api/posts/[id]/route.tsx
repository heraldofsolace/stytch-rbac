import { PrismaClient } from '@prisma/client'
import { authorize } from '@/lib/stytch-client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string }}) {
    const organization_id = request.nextUrl.searchParams.get("organization_id");

    if(!organization_id) return Response.json({ success: false, message: 'Organization ID is required' }, { status: 400 });

    const { authorized } = await authorize({
        organization_id,
        resource_id: 'post',
        action: 'read',
    });

    if(!authorized) return Response.json({ success: false, message: 'Unauthorized', post: null }, { status: 403 });

    const post = await prisma.post.findUnique({
        where: {
            id: Number(params.id),
            organization: organization_id
        }
    })
    if(!post) return Response.json({ success: false, message: 'Post not found', post: null }, { status: 404 });

    return Response.json({ success: true, post });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string }}) {
    const organization_id = request.nextUrl.searchParams.get("organization_id");

    if(!organization_id) return Response.json({ success: false, message: 'Organization ID is required' }, { status: 400 });

    const { authorized } = await authorize({
        organization_id,
        resource_id: 'post',
        action: 'update',
    });

    if(!authorized) return Response.json({ success: false, message: 'Unauthorized', post: null }, { status: 403 });

    const data: { title: string, content: string } = await request.json();
    
        const post = await prisma.post.update({
            where: {
                id: Number(params.id),
                organization: organization_id
            },
            data: {
                title: data.title,
                content: data.content,
            }
        });

        return Response.json({ success: true, post });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string }}) {
    const organization_id = request.nextUrl.searchParams.get("organization_id");

    if(!organization_id) return Response.json({ success: false, message: 'Organization ID is required' }, { status: 400 });

    const { authorized } = await authorize({
        organization_id,
        resource_id: 'post',
        action: 'delete',
    });

    if(!authorized) return Response.json({ success: false, message: 'Unauthorized', post: null }, { status: 403 });

    const post = await prisma.post.delete({
        where: {
            id: Number(params.id),
            organization: organization_id
        }
    });
    return Response.json({ success: true, post });
}