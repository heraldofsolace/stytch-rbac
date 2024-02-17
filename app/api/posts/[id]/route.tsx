import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest } from 'next';

const posts = [
    {
        id: 1,
        title: 'First Post',
        content: 'This is the first post'
    },
    {
        id: 2,
        title: 'Second Post',
        content: 'This is the second post'
    },
    {
        id: 3,
        title: 'Third Post',
        content: 'This is the third post'
    }
];

export async function GET(request: NextApiRequest, { params }: { params: { id: string } }) {
    return Response.json({ success: true, post: posts.find(post => post.id.toString() == params.id) });
}