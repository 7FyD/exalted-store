import React from "react";
import { Metadata } from "next";

import { mergeOpenGraph } from "../../../_utilities/mergeOpenGraph";
import RanksPage from "../Ranks";

export default async function Page({ params: { slug = "ranks" } }) {
  return (
    <React.Fragment>
      {slug.toLocaleLowerCase() === "ranks" ? (
        <section className="space-y-8">
          <RanksPage />
        </section>
      ) : (
        <>
          <h2 className="text-center">Coming soon...</h2>
        </>
      )}
    </React.Fragment>
  );
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  slug = typeof slug === "string" ? slug[0].toUpperCase() + slug.slice(1) : "N/A";
  return {
    title: `Exalted Kingdom Store - ${slug}`,
    description: `Product category - ${slug}.`,
    openGraph: mergeOpenGraph({
      title: `Exalted Kingdom Store - ${slug}`,
      url: `/category/${slug}`,
    }),
  };
}
