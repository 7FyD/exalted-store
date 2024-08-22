import React from "react";

import { Product } from "../../../payload/payload-types";
import { Gutter } from "../../_components/Gutter";
import ProductsCarousel from "../../_components/ProductsCarousel";
import ProductCard from "../../_components/ProductsCarousel/ProductCard";
import RichText from "../../_components/RichText";

import classes from "./index.module.scss";

export type RelatedProductsProps = {
  blockType: "relatedProducts";
  blockName: string;
  introContent?: any;
  docs?: (string | Product)[];
  relationTo: "products";
};

const isProduct = (item: string | Product): item is Product => {
  return (item as Product).id !== undefined;
};

export const RelatedProducts: React.FC<RelatedProductsProps> = props => {
  const { introContent, docs, relationTo } = props;
  const productDocs: Product[] = docs.filter(isProduct);
  return (
    <Gutter>
      <h3 className="text-center text-lg font-semibold my-8">RELATED ITEMS</h3>
      {productDocs.length < 3 ? (
        <div className="flex flex-row justify-center items-center gap-8">
          {productDocs.map(product => {
            return (
              <ProductCard
                key={product.slug}
                slug={product.slug}
                title={product.title}
                categories={product.categories}
                imageUrl={
                  typeof product.meta.image === "string"
                    ? product.meta.image
                    : product.meta.image.url
                }
              />
            );
          })}
        </div>
      ) : (
        <ProductsCarousel products={productDocs} options={{ align: "end", loop: true }} />
      )}
    </Gutter>
  );
};
