import fs from "fs/promises";
import path from "path";
import formidable from "formidable";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = "./public/uploads";

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  try {
    const { files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req.body as any, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    return NextResponse.json({
      message: "Files uploaded successfully!",
      files,
    });
  } catch (error) {
    console.error("File upload failed:", error);
    return NextResponse.json(
      { error: "File upload failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      const files = await fs.readdir(uploadDir);
      const fileData = files.map((file) => ({
        name: file,
        path: path.join(uploadDir, file),
      }));
  
      return NextResponse.json({ files: fileData });
    } catch (error) {
      console.error("Failed to fetch files:", error);
      return NextResponse.json({ error: "Could not fetch files." }, { status: 500 });
    }
  }
  
