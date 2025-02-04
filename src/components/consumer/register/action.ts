"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
  referralCode,
  interests = [],
}: {
  email: string;
  password: string;
  passwordConfirm: string;
  referralCode?: string;
  interests?: string[]; // Ensure this expects an array
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: true, message: error.message };

  const userId = data.user?.id;
  if (!userId) return { error: true, message: "User ID not found" };

  if (interests.length > 0) {
    await supabase.from("user_interests").insert([{ user_id: userId, interests }]); // Pass as array
  }

  return { success: true, message: "Registration successful!" };
};
