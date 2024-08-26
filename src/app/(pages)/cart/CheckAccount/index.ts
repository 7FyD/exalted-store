"use server";

type MojangResponse =
  | {
      id: string;
      name: string;
    }
  | {
      path: string;
      errorMessage: string;
    };

export const CheckAccount = async (
  username: string,
): Promise<{ success: string } | { error: string }> => {
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    const data: MojangResponse = await response.json();
    console.log(data); //dev only
    if ("errorMessage" in data) {
      return { error: data.errorMessage };
    }
    return { success: "Account found" };
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
    return { error: "Internal server error. Please try again later." };
  }
};

