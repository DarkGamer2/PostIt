"use client";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PostReactions({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [shares, setShares] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isLiked ? "unlike" : "like" }),
      });
      if (!response.ok) throw new Error("Failed to update like status");
      const data = await response.json();
      setLikes(data.likes);
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/reactions`);
        if (!response.ok) throw new Error("Failed to fetch reactions");
        const data = await response.json();
        setLikes(data.likes);
        setComments(data.comments);
        setShares(data.shares);
        setIsLiked(data.isLiked);
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };
    fetchReactions();
  }, [postId]);

  return (
    <div className="reaction-section">
      <div className="flex items-center">
        <motion.button
          whileTap={{ scale: 1.2, rotate: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="px-2 py-1 rounded transition-colors"
          onClick={handleLike}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <FavoriteIcon className={`inline mr-1 ${isLiked ? "text-red-500" : "text-gray-400"}`} />
        </motion.button>
        <span className="text-gray-700 font-semibold mr-4">{likes}</span>
        {/* You can add comments and shares here if you want */}
      </div>
    </div>
  );
}