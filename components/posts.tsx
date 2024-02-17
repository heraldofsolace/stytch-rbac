import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import InviteForm from '@/components/invite-form';
import { Organization } from 'stytch';

export default async function Posts({
    organization, jwt
}: { organization: Organization, jwt: string }) {
    const { posts }:{ posts: { id: Number, title: string, content: string }[] } = await fetch('http://localhost:3000/api/posts').then((res) => res.json());

    return (
        <Card className="w-full max-w-sm">
        <CardHeader className="pb-4">
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.map((post) => {
            return (
              <div key={post.id.toString()} className="flex justify-between">
               <span className='bold'>{post.title}</span>
                <span>{post.content}</span>
              </div>
            );
          })
          }
          <Separator className="mb-4" />
          <InviteForm organization_slug={organization.organization_slug} />
        </CardContent>

      </Card>
    )
}