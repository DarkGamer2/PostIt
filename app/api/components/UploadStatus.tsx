"use client";

import React, { useState, useEffect } from "react";

const UploadStatus = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/upload");
        const data = await response.json();
        if (data.files) {
          setFiles(data.files);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []); // Fetch files when the component mounts

  return (
    <div>
      <h3>Uploaded Files</h3>
      {loading ? (
        <p>Loading files...</p>
      ) : files.length > 0 ? (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
};

export default UploadStatus;
