import fs from "fs/promises";
import path from "path";
import formidable, { File, Files } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const uploadDir = "../../public/uploads";

  if (req.method === "POST") {
    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
    });

    try {
      // Properly type the resolved object
      const { files } = await new Promise<{
        fields: formidable.Fields;
        files: Files;
      }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      // Convert the files object into an array for easier processing
      const uploadedFiles: File[] = [];
      for (const fileKey in files) {
        const file = files[fileKey];
        if (file instanceof Array) {
          uploadedFiles.push(...file); // Add all files in case of multiple uploads
        } else if (file) {
          uploadedFiles.push(file); // Single file
        }
      }

      res.status(200).json({
        message: "Files uploaded successfully!",
        files: uploadedFiles.map((file) => ({
          originalFilename: file.originalFilename,
          filepath: file.filepath,
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "File upload failed." });
    }
  } else if (req.method === "GET") {
    try {
      const files = await fs.readdir(uploadDir);
      const fileData = files.map((file) => ({
        name: file,
        path: path.join(uploadDir, file),
      }));

      res.status(200).json({ files: fileData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not fetch files." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
