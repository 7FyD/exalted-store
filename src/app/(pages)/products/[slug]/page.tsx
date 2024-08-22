import React from "react";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound, usePathname } from "next/navigation";

import { Product as ProductType } from "../../../../payload/payload-types";
import { fetchDoc } from "../../../_api/fetchDoc";
import { fetchDocs } from "../../../_api/fetchDocs";
import { Blocks } from "../../../_components/Blocks";
import Breadcrumbs from "../../../_components/Breadcrumbs";
import { PaywallBlocks } from "../../../_components/PaywallBlocks";
import { ProductHero } from "../../../_heros/Product";
import { useFilter } from "../../../_providers/Filter";
import { generateMeta } from "../../../_utilities/generateMeta";

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export const dynamic = "force-dynamic";

export default async function Product({ params: { slug } }) {
  const { isEnabled: isDraftMode } = draftMode();
  let product: ProductType | null = null;
  try {
    product = await fetchDoc<ProductType>({
      collection: "products",
      slug,
      draft: isDraftMode,
    });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  if (!product) {
    notFound();
  }

  const { layout, relatedProducts } = product;

  return (
    <React.Fragment>
      <Breadcrumbs />
      <ProductHero product={product} />
      {/* <Blocks blocks={layout} /> */}
      {product?.enablePaywall && <PaywallBlocks productSlug={slug as string} disableTopPadding />}
      {relatedProducts.length > 0 && (
        <Blocks
          disableTopPadding
          blocks={[
            {
              blockType: "relatedProducts",
              blockName: "Related Product",
              relationTo: "products",
              introContent: [
                {
                  type: "h4",
                  children: [
                    {
                      text: "Related Products",
                    },
                  ],
                },
              ],
              docs: relatedProducts,
            },
          ]}
        />
      )}
    </React.Fragment>
  );
}

export async function generateStaticParams() {
  try {
    const products = await fetchDocs<ProductType>("products");
    return products?.map(({ slug }) => slug);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode();

  let product: ProductType | null = null;

  try {
    product = await fetchDoc<ProductType>({
      collection: "products",
      slug,
      draft: isDraftMode,
    });
  } catch (error) {}

  return generateMeta({ doc: product });
}
