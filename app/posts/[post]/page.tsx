
import { Inter,Lobster } from "next/font/google"
import { db } from "@/app/lib/db"; // If you want
import Image from "next/image";
import { NavigationBar } from "@/app/components/NavigationBar";
import PostReactions from "@/app/components/PostReactions";
interface postProps{
title:string,
content:string,
id:string
media ?: string[]
}
const lobster = Lobster({
  variable: "--font-lobster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
export default async function Post({ params }: { params: Promise<{ post: string }> })  {
  const { post } = await params;

  const postData = await db.post.findUnique({
    where: { id: post },
    select: {
      title: true,
      content: true,
      media: true,
      id: true,
    },
  });

  if (!postData) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <NavigationBar/>
      <h1 className={`text-center text-2xl ${lobster.className} my-2`}>{postData.title}</h1>
      <div className="p-4 text-center">{postData.content}</div>
      <div>
        <h3>Media</h3>
        <div className="flex">
          {postData.media && postData.media.length > 0 ? (
            postData.media.map((mediaItem: string, index: number) => (
              <Image
                key={index}
                src={mediaItem}
                alt={`Media item ${index + 1}`}
                width={200}
                height={200}
                className="m-2 rounded-lg"
              />
            ))
          ) : (
            <p>No media available for this post.</p>
          )}
        </div>
      </div>
      <PostReactions postId={postData.id}/>
      <div id="comments">
        <h2 className="text-xl mt-4">Comments</h2>
        <div className="comment">
          <p className="text-gray-700">This is a sample comment.</p>
        </div>
      </div>
    </div>
  );
}
