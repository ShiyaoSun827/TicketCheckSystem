// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    // 使用 req.formData() 获取表单数据
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 将 File 对象转换为 Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 生成文件内容的 SHA256 校验值
    const hash = createHash("sha256").update(buffer).digest("hex");

    // 取出原文件扩展名
    const ext = path.extname(file.name);
    // 拼接生成的文件名，用校验值加上扩展名
    const fileName = `${hash}${ext}`;
    const filePath = path.join(process.cwd(), "public", "images", fileName);

    try {
      // 尝试访问该文件，如果存在则直接返回 URL
      await fs.access(filePath);
      console.log("File already exists:", fileName);
      return NextResponse.json({ url: `/images/${fileName}` });
    } catch (e) {
      // 文件不存在，则先确保目录存在，然后写入文件
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buffer);
      return NextResponse.json({ url: `/images/${fileName}` });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.error();
  }
}
