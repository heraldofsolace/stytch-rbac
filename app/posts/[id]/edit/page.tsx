'use client';

import Authenticated from "@/components/authenticated";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "@prisma/client";
import { useStytchOrganization } from "@stytch/nextjs/b2b";
import moment from "moment";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    title: z.string(),
    content: z.string(),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title,
      content: post?.content,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(values)
    });
    const data = await response.json();
    if(!data.success) return alert('Error creating post');
    setPost(data.post);
    window.location.href = `/posts/${params.id}`;
    form.reset();
  }

  return(
      <Authenticated>
        <div className="flex flex-col text-sm w-full max-w-sm p-2">
          {loading || !isInitialized || !organization ? <span>Loading...</span>:
          post?
            <div>
              <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field}) => (
                      <FormItem>
                        <FormLabel>
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={post.title} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}></FormField>
                  <FormField
                  control={form.control}
                  name='content'
                  render={({ field}) => (
                      <FormItem>
                        <FormLabel>
                          Content
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder={post.content} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}></FormField>
                  <Button type='submit' className='mt-8'>Update Post</Button>
            </form>
          </Form>
            </div>
            :<span className="text-red-800">Post not found</span>
          }
        </div>
      </Authenticated>
    )

}