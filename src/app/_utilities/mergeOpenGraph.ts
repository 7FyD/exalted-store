import type { Metadata } from "next";

const defaultOpenGraph: Metadata["openGraph"] = {
  type: "website",
  siteName: "Exalted Kingdom Store - Purchase ranks for factions",
  title: "Exalted Kingdom Store - Purchase ranks for factions",
  description:
    "Exalted Kingdom Store - Purchase ranks to support our server and receive benefits in game!",
  images: [
    {
      url: "https://i.imgur.com/nUuXXbA.png",
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
