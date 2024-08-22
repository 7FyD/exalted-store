import type { Metadata } from "next";

const defaultOpenGraph: Metadata["openGraph"] = {
  type: "website",
  siteName: "7FyD Store | Online Shopping for Latest Clothes & Fashion",
  title: "7FyD Store | Online Shopping for Latest Clothes & Fashion",
  description:
    "7FyD Store, the place where fashion meets quality. Founded with a passion for style and an unwavering commitment to excellence, we pride ourselves on offering the finest clothing that combines the latest trends with timeless elegance. ",
  images: [
    {
      url: "https://img.freepik.com/free-vector/geometric-triangle-logo_1043-89.jpg?t=st=1718467101~exp=1718470701~hmac=b46bd01a2f475c07845483ef5d654cc58755043ffba26475714fba2ef3e039f9",
    },
  ],
};

export const mergeOpenGraph = (og?: Metadata["openGraph"]): Metadata["openGraph"] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  };
};
