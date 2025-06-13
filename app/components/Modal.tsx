"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bebas_Neue } from "next/font/google";
import { Attach } from "react-ionicons";
import { toast } from "react-toastify";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const Modal = ({ openModal, handleModal }: any) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!title || !content) {
      alert("Please fill in the title and content.");
      return;
    }

    setIsLoading(true);
    setSuccess(false);
    setError(false);

    try {
      const postResponse = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!postResponse.ok) {
        throw new Error("Failed to create post");
      }

      setSuccess(true);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error during post creation:", error);
      setError(true);
      toast.error("Something went wrong!");
    }

    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {openModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="relative bg-white shadow-lg py-4 px-6 rounded-md max-w-md w-full z-10 pointer-events-auto"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`${bebasNeue.className} text-blue-500 text-center mb-4`}>
              Create A Post
            </h2>
            <form>
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-4 border rounded-md"
              />
              <label className="block text-gray-700">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-40 p-2 mb-4 border rounded-md"
                rows={5}
              />

              <label className="block text-gray-700 mb-2">Attach Media</label>
              <div className="flex items-center mb-4">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="fileInput"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  <Attach color="white" height="20px" width="20px" />
                  <span className="ml-2">Choose Files</span>
                </button>
              </div>

              <div className="flex justify-between">
                <motion.button
                  type="button"
                  className={`flex items-center justify-center gap-2 rounded-md text-white px-4 py-2 transition-all duration-300 ${
                    isLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : success
                      ? "bg-green-500"
                      : error
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                  onClick={handleUpload}
                  disabled={isLoading}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: isLoading ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <FaSpinner className="animate-spin" />
                    </motion.span>
                  ) : success ? (
                    <FaCheckCircle />
                  ) : error ? (
                    <FaTimesCircle />
                  ) : null}
                  {isLoading ? "Uploading..." : success ? "Post Created" : error ? "Error" : "Create Post"}
                </motion.button>
                <button
                  type="button"
                  className="bg-red-500 rounded-md text-white px-4 py-2"
                  onClick={handleModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
