"use server";

export type MojangResponse =
  | {
      id: string;
      name: string;
    }
  | {
      path: string;
      errorMessage: string;
    };

export const checkAccount = async (): Promise<MojangResponse | { error: string }> => {
  try {
    const response = await fetch("https://api.mojang.com/users/profiles/minecraft/ZEW69");
    const data = await response.json();
    console.log(data); //dev only
    return data;
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
    return { error: "Internal server error. Please try again later." };
  }
};
