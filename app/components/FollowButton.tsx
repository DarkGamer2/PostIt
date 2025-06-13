'use client';
import { useState } from "react";
export default function FollowButton({}) {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow=async()=>{
        await fetch('/api/follow',{
            method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({
                followerId: 'currentUserId', // Replace with actual user ID
                followingId: 'targetUserId', // Replace with actual target user ID
                action: isFollowing ? 'unfollow' : 'follow',})
        })
        setIsFollowing(true);
    }
    return (
        <button
            className={`${
                isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-4 py-2 rounded transition-colors`}
            onClick={handleFollow}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    );
}