import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    // Use req.formData() to parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File object to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate SHA256 hash of file content
    const hash = createHash("sha256").update(buffer).digest("hex");

    // Get original file extension
    const ext = path.extname(file.name);
    // Generate file name using hash + extension
    const fileName = `${hash}${ext}`;
    const filePath = path.join(process.cwd(), "public", "images", fileName);

    try {
      // Check if file already exists, return URL if so
      await fs.access(filePath);
      console.log("File already exists:", fileName);
      return NextResponse.json({ url: `/images/${fileName}` });
    } catch (e) {
      // File doesn't exist, ensure directory exists and write file
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buffer);
      return NextResponse.json({ url: `/images/${fileName}` });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.error();
  }
}
