"use client";
import FollowButton from "../components/FollowButton";
import Image from "next/image";
import PlaceholderProfilePic from "../assets/images/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";
import { NavigationBar } from "../components/NavigationBar";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { useParams } from "next/navigation";
import Link from "next/link";
import VerifiedCheckmark from "../components/VerifiedCheckmark";
const inter = Inter({ subsets: ["latin"] });

type Post = {
  title: string;
  content: string;
  id: string;
};

type ProfileDetails = {
  username: string;
  followers: number;
  following: number;
  fullName?: string;
  verified?: boolean;
};
export default function ProfileDetails() {
  const params = useParams();
  const username = params.username as string; // Extract username from params
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
    username: "",
    followers: 0,
    following: 0,
    verified: true,
  });
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!username) return;
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch(`/api/profile/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile details");
        }
        const profileDetails = await response.json();
        console.log("Profile Details:", profileDetails);
        setProfileDetails(profileDetails);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, [username]);

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col items-center">
        <Image
          alt="profile pic"
          src={PlaceholderProfilePic}
          className="rounded-full bg-gray-400"
          width={200}
          height={200}
        />
        <div className="flex items-center space-x-2 my-2">
          <h1 className="text-2xl text-center">{profileDetails.username}</h1>
          {profileDetails.verified ? <VerifiedCheckmark /> : null}
        </div>
        <div className="flex justify-center items-center my-4">
          <FollowButton />
          <div className="flex flex-col items-center mx-4">
            <span className="text-lg font-semibold">Followers</span>
            <span className="text-xl">{profileDetails.followers}</span>
          </div>
          <div className="flex flex-col items-center mx-4">
            <span className="text-lg font-semibold">Following</span>
            <span className="text-xl">{profileDetails.following}</span>
          </div>
        </div>
        <div id="post details" className="w-full grid-cols-3 grid gap-4 p-4">
          {posts.length > 0 ? (
            posts.map((post: Post, index) => (
              <Link href={`/posts/${post.id}`} key={index}>
                <div className="border p-4 my-2 rounded-lg">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-gray-700">{post.content}</p>
                </div>
              </Link>
            ))
          ) : (
            <span className={`block text-center text-2xl ${inter.className}`}>
              No Posts Yet
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
