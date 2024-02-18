'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Post } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Organization } from 'stytch';
import { Input } from './ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const formSchema = z.object({
  title: z.string(),
  content: z.string(),
});


export default function Posts({
    organization, jwt
}: { organization: Organization, jwt: string }) {
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/posts');
          const data = await response.json();
          setPosts(data.posts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      fetchData();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: '',
        content: '',
      },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if(!data.success) return alert('Error creating post');
      setPosts([...posts, data.post]);
      form.reset();
    }
    const router = useRouter();
    return (
        <Card className="w-full max-w-sm">
        <CardHeader className="pb-4">
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.map((post) => {
            return (
              <div key={post.id.toString()} className="flex flex-col justify-between mb-4">
                <Link href={`/posts/${post.id}`}>
                  <span className='text-blue-800'>{post.title}</span>
                </Link> 
                <p className='text-gray-500 text-sm'>{post.content}</p>
              </div>
            );
          })
          }
          <Separator className="my-4" />
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
                          <Input placeholder='Title' {...field} />
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
                          <Textarea placeholder='Content' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}></FormField>
                  <Button type='submit' className='mt-8'>Create Post</Button>
            </form>
          </Form>
        </CardContent>

      </Card>
    )
}