'use client';

import Authenticated from "@/components/authenticated";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Post } from "@prisma/client";
import { useStytchIsAuthorized, useStytchOrganization } from "@stytch/nextjs/b2b";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Post({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const { organization, isInitialized } = useStytchOrganization();

  const { isAuthorized: authorizedToEdit } = useStytchIsAuthorized('post', 'update');
  const { isAuthorized: authorizedToDelete } = useStytchIsAuthorized('post', 'delete');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const { post, success, message } = await fetch(`/api/posts/${params.id}?organization_id=${organization?.organization_id}`).then((res) => res.json());
      if(success)
        setPost(post);
      else if (message === 'Unauthorized') {
        alert("You're not allowed to view this post");
        router.push(`/${organization?.organization_slug}/dashboard`);
      }
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

                  <Button className="mr-2" onClick={() => window.location.href=`/posts/${post.id}/edit`} disabled={!authorizedToEdit}>Edit</Button>
                  <Button className="mr-2" onClick={async () => {
                    const { success, message } = await fetch(`/api/posts/${post.id}?organization_id=${organization.organization_id}`, { method: 'DELETE' }).then(res => res.json());
                    if(!success) return alert(message);
                    router.push(`/${organization.organization_slug}/dashboard`);
                  }} disabled={!authorizedToDelete}>Delete</Button>
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