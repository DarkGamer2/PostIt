"use client";
import Modal from "../components/Modal";
import { NavigationBar } from "../components/NavigationBar";
import { Bebas_Neue } from "next/font/google";
import { useState, useEffect } from "react";
import VideoCall from "../components/VideoCall";
import PostReactions from "../components/PostReactions";
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

interface Post {
  _id: string;
  title: string;
  content: string;
  author:string;
}

export default function Home() {
  const [openModal, setModal] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/posts");
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleModal = () => {
    setModal(!openModal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <NavigationBar />
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`${bebasNeue.className} text-3xl text-blue-700`}>
            All Posts
          </h1>
          <button
            className={`${bebasNeue.className} rounded-lg bg-blue-500 hover:bg-blue-600 transition px-4 py-2 text-white shadow`}
            onClick={handleModal}
          >
            + New Post
          </button>
        </div>
        <div className="space-y-6">
          {posts.map((post: Post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h2
                className={`${bebasNeue.className} text-2xl font-semibold mb-2 text-blue-800`}
              >
                {post.title}
              </h2>
              <h3>{post.author}</h3>
              <p className="text-gray-700">{post.content}</p>
              <PostReactions postId={post._id} />
            </div>
          ))}
        </div>
      </div>
      <Modal openModal={openModal} handleModal={handleModal} />
    </div>
  );
}
