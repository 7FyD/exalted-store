import React from "react";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { Category, Page as PageC, Product } from "../../../payload/payload-types";
import { staticHome } from "../../../payload/seed/home-static";
import { fetchDoc } from "../../_api/fetchDoc";
import { fetchDocs } from "../../_api/fetchDocs";
import { Blocks } from "../../_components/Blocks";
import { Gutter } from "../../_components/Gutter";
import { Hero } from "../../_components/Hero";
import { generateMeta } from "../../_utilities/generateMeta";

// Payload Cloud caches all files through Cloudflare, so we don't need Next.js to cache them as well
// This means that we can turn off Next.js data caching and instead rely solely on the Cloudflare CDN
// To do this, we include the `no-cache` header on the fetch requests used to get the data for this page
// But we also need to force Next.js to dynamically render this page on each request for preview mode to work
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
// If you are not using Payload Cloud then this line can be removed, see `../../../README.md#cache`
export const dynamic = "force-dynamic";

import Categories from "../../_components/Categories";

export default async function Page({ params: { slug = "home" } }) {
  const { isEnabled: isDraftMode } = draftMode();

  let page: PageC | null = null;
  let categories: Category[] | null = null;
  let products: Product[] | null = null;
  try {
    page = await fetchDoc<PageC>({
      collection: "pages",
      slug,
      draft: isDraftMode,
    });

    categories = await fetchDocs<Category>("categories", isDraftMode, 3);
    products = await fetchDocs<Product>("products", isDraftMode, 5, "desc");
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    console.error(error);
  }

  if (!page) {
    return notFound();
  }

  const { hero, layout } = page;

  return (
    <React.Fragment>
      {slug === "home" ? (
        <section className="space-y-8">
          <Hero {...hero} />
          <Gutter className="space-y-16">
            <Categories categories={categories} />
            <div className="container">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa deleniti delectus
              autem? Eligendi dignissimos dolor animi, quam saepe harum impedit exercitationem fuga.
              Voluptates architecto accusamus quis mollitia nostrum! Quasi, a?
            </div>
          </Gutter>
        </section>
      ) : (
        <>
          <Hero {...hero} />
          <Blocks
            blocks={layout}
            disableTopPadding={!hero || hero?.type === "none" || hero?.type === "lowImpact"}
          />
        </>
      )}
    </React.Fragment>
  );
}

export async function generateStaticParams() {
  try {
    const pages = await fetchDocs<PageC>("pages");
    return pages?.map(({ slug }) => slug);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params: { slug = "home" } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode();

  let page: PageC | null = null;

  try {
    page = await fetchDoc<PageC>({
      collection: "pages",
      slug,
      draft: isDraftMode,
    });
  } catch (error) {
    // don't throw an error if the fetch fails
    // this is so that we can render a static home page for the demo
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // in production you may want to redirect to a 404  page or at least log the error somewhere
  }

  if (!page && slug === "home") {
    page = staticHome;
  }

  return generateMeta({ doc: page });
}