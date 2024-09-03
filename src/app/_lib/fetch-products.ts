import type { Product } from "../../payload/payload-types";
import type { Result } from "../_components/CollectionArchive";

export const fetchProducts = async (categoryTitle: string): Promise<Product[]> => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_SERVER_URL
    }/api/products?where[categories.title][equals]=${encodeURIComponent(
      categoryTitle.toLowerCase(),
    )}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: Result = await response.json();

  if (data.docs.every(product => typeof product === "object" && product !== null)) {
    return data.docs.toReversed() as Product[];
  } else {
    throw new Error("Unexpected product type returned.");
  }
};
