// src/app/api/signup/route.ts
import { signUpWithEmail } from "@/lib/auth-actions";

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await signUpWithEmail(formData);
  return Response.json(result);
}
