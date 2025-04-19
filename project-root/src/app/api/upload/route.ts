import {NextRequest,NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { S3Client,HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import formidable from 'formidable';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

//modifeid for upload imgs to cdn -- note:admin account,add/upload method
const s3Client = new S3Client({
  region: 'us-east-1',  
  endpoint: process.env.DO_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});







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
    const useCDN = process.env.USE_CDN === 'true';

    if (useCDN) {



      const bucket = process.env.DO_SPACES_BUCKET!;
      const cdnUrl = process.env.CDN_URL!;

      // Check if file already exists in Spaces
      try {
        const headCommand = new HeadObjectCommand({
          Bucket: bucket,
          Key: fileName,
        });
        await s3Client.send(headCommand);

        // File exists — skip upload
        console.log("File already exists in DO Spaces:", fileName);
        return NextResponse.json({ imageUrl: `${cdnUrl}/${fileName}` });
      } catch (headErr: any) {
        if (headErr.name !== "NotFound") {
          throw headErr; // some other error, not just "file not found"
        }
      }

    
      //canceled
      //const filePath = path.join(process.cwd(), "public", "images", fileName);


      // Upload file to digital ocean  Spaces --
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.DO_SPACES_BUCKET, // Bucket name
          Key: fileName,                        // store path
          Body: buffer,                         // content
          ACL: "public-read",                   // public access
          ContentType: file.type,               // file type
        },
      });

      await upload.done();

  // Return public CDN URL
    return NextResponse.json({ url: `${process.env.CDN_URL}/${fileName}` });
    }
    else{
      // 🟡 Local upload to /public/images
      const filePath = path.join(process.cwd(), "public", "images", fileName);

      try {
        await fs.access(filePath);
        console.log("Local: File already exists:", fileName);
        return NextResponse.json({ url: `/images/${fileName}` });
      } catch {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, buffer);
        return NextResponse.json({ url: `/images/${fileName}` });
      }
    
    }

} catch (error) {
  console.error("Upload error:", error);
  return NextResponse.json({ error: "Upload failed" }, { status: 500 });
}
}
