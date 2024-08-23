import type { Product } from "../../payload/payload-types";
import type { Result } from "../_components/CollectionArchive";

export const fetchProducts = async (categoryTitle: string): Promise<Product[]> => {
  const response = await fetch(
    `http://localhost:3000/api/products?where[categories.title][equals]=${encodeURIComponent(
      categoryTitle.toLowerCase(),
    )}`,
  );
  console.log(categoryTitle);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: Result = await response.json();

  if (data.docs.every(product => typeof product !== "string")) return data.docs;
  else {
    throw new Error("Unexpected product type returned.");
  }
};
