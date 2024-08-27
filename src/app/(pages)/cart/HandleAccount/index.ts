"use server";

import { cookies } from "next/headers";

type MojangResponse =
  | {
      id: string;
      name: string;
    }
  | {
      path: string;
      errorMessage: string;
    };

export const addUsername = async (
  username: string,
): Promise<{ success: string } | { error: string }> => {
  const checkUsername = (): string | null => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    return usernameRegex.test(username) ? username : null;
  };

  const sanitizedUsername = checkUsername();
  if (!sanitizedUsername) {
    return {
      error: "Invalid username.",
    };
  }
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    const data: MojangResponse = await response.json();
    if ("errorMessage" in data) {
      return { error: data.errorMessage };
    }
    const cookieData = JSON.stringify({ id: data.id, name: data.name });
    cookies().set("minecraft_account", cookieData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: "Authenticated." };
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
    return { error: "Internal server error. Please try again later." };
  }
};

export const removeUsername = async (): Promise<{ success: string } | { error: string }> => {
  try {
    cookies().delete("minecraft_account");
    return { success: "Account removed." };
  } catch (error: unknown) {
    console.error("Error deleting account:", error);
    return { error: "Internal server error. Please try again later." };
  }
};
