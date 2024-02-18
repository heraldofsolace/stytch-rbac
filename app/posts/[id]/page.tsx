'use client';

import Authenticated from "@/components/authenticated";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Post } from "@prisma/client";
import { useStytchOrganization } from "@stytch/nextjs/b2b";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Post({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);

  const { organization, isInitialized } = useStytchOrganization();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const { post } = await fetch(`/api/posts/${params.id}`).then((res) => res.json());
      setPost(post);
      setLoading(false);
    };

    fetchData();
  }, []);

  return(
      <Authenticated>
        <div className="flex flex-col text-sm w-full max-w-sm p-2">
          {loading || !isInitialized || !organization ? <span>Loading...</span>:
          post?
            <div>
              <Card>
                <CardHeader>
                  <span className="text-3xl">{post.title}</span>
                  <span className="text-xs">by <strong>{post.authorEmail}</strong> ({moment(post.createdAt).format('D/MM/YYYY')})</span>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {post.content}
                  </p>
                  <Separator className="my-8" />
                  <Button className="mr-2" onClick={() => window.location.href=`/posts/${post.id}/edit`}>Edit</Button>
                  <Button className="mr-2" onClick={async () => {
                    await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
                    window.location.href = `/${organization.organization_slug}/dashboard`;
                  }}>Delete</Button>
                  <Button onClick={() => window.location.href=`/${organization.organization_slug}/dashboard`}>Back to dashboard</Button>
                </CardContent>
              </Card>
            </div>
            :<span className="text-red-800">Post not found</span>
          }
        </div>
      </Authenticated>
    )

}