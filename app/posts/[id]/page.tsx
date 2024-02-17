import IsAuthenticated from "@/components/is-authenticated";
import { authenticate } from "@/lib/stytch-client";

export default async function Post({ params }: { params: { id: string } }) {
    const { post } = await fetch(`http://localhost:3000/api/posts/${params.id}`).then((res) => res.json());
    console.log(post);
    return(
        <IsAuthenticated>
        <div className="flex flex-col text-sm w-full max-w-sm p-2">
          <div>
            <h1 className="font-semibold">{post.title}</h1>
            <span className="font-mono text-gray-700">
              {post.content}
            </span>
          </div>
        </div>
      </IsAuthenticated>
    )

}