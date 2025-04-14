"use server";

import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name,
  });

  console.log("Sign-up response:", { data, error });

  if (error) {
    return {
      success: false,
      message: `Error: ${error.message || "Sign-up failed"}`,
    };
  }

  return {
    success: true,
    message: "Sign-up successful!",
    redirectTo: "http://localhost:3000/",
  };
  
}

// export async function signInWithEmail(formData: FormData) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const callbackURL = "/dashboard";

//   const { data, error } = await authClient.signIn.email({
//     email,
//     password,
//     callbackURL,
//   });
  
//   console.log("Sign-in response:", { data, error });

//   if (error) {
//     return {
//       success: false,
//       message: `Error: ${error.message || "An unexpected error occurred"}`,
//     };
//   }

//   return {
//     success: true,
//     message: "Sign-in successful!",
//     redirectTo: "http://localhost:3000/dashboard",

   
//   };
// }
export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await auth.api.signInEmail({
    body: { email, password },
  });
  
  console.log("Sign-in result:", result);

  if (!result || !result.token) {
    return {
      success: false,
      message: "Sign-in failed or invalid credentials",
    };
  }
  
  return {
    success: true,
    message: "Sign-in successful!",
    redirectTo: "http://localhost:3000/dashboard/user",
  };

}