// src/app/api/auth/[...all]/route.ts
// import { auth } from "@/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";
// console.log("✅ [...all] dynamic API handler registered!");
// export const { GET, POST } = toNextJsHandler(auth);

import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

//export const { POST, GET } = toNextJsHandler(auth);
export const { GET } = toNextJsHandler(auth);

export const POST = async (req: NextRequest) => {
    const res = await auth.handler(req);
    return res;
};

