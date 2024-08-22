"use client";

import React, { Fragment, useState } from "react";
import Link from "next/link";

import { Category, Product } from "../../../payload/payload-types";
import Accordion from "../../_components/Accordion";
import { AddToCartButton } from "../../_components/AddToCartButton";
import { Gutter } from "../../_components/Gutter";
import { Media } from "../../_components/Media";
import { Price } from "../../_components/Price";
import { Button } from "../../_components/ui/button";
import { useFilter } from "../../_providers/Filter";
import { priceFromJSON } from "../../_utilities/priceUtilities";

import classes from "./index.module.scss";

export const ProductHero: React.FC<{
  product: Product;
}> = ({ product }) => {
  const {
    title,
    additionalInformation,
    categories,
    meta: { image: metaImage, description } = {},
  } = product;
  const { setCategoryFilters } = useFilter();
  const [size, setSize] = useState<string>(product.sizes[0].size);
  return (
    <Gutter className={classes.productHero}>
      <div className={classes.mediaWrapper}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== "string" && (
          <Media imgClassName={classes.image} resource={metaImage} fill />
        )}
      </div>
      <div className={classes.details}>
        <h3 className={classes.title}>{title}</h3>
        <div className={classes.categoryWrapper}>
          <div className={classes.categories}>
            {categories?.map((category, index) => {
              const { title: categoryTitle } = category as Category;

              const titleToUse = categoryTitle || "Generic";
              const isLast = index === categories.length - 1;

              return (
                <Link
                  href="/products"
                  onClick={() => setCategoryFilters(typeof category !== "string" && [category.id])}
                  key={index}
                  className={classes.category}
                >
                  {titleToUse} {!isLast && <Fragment>, &nbsp;</Fragment>}
                </Link>
              );
            })}
          </div>
          <span className={classes.separator}>|</span>
          <p className={classes.stock}> In stock</p>
        </div>
        <Price size={size} product={product} button={false} />
        <div className={classes.description}>
          <p>{description}</p>
        </div>
        <h2 className="text-lg font-semibold mb-2">Size</h2>
        <div className="flex flex-row flex-wrap gap-6 mb-6">
          {product.sizes?.map((item, index) => {
            return (
              <Button
                className={`rounded-full w-16 border-2 transition-colors ${
                  size === item.size
                    ? "bg-black hover:bg-black text-white  border-0"
                    : "bg-white hover:bg-white text-black  hover:border-black"
                }`}
                key={index}
                onClick={() => setSize(item.size)}
              >
                {item.size}
              </Button>
            );
          })}
        </div>
        <AddToCartButton size={size} product={product} className={classes.addToCartButton} />
        {additionalInformation && <Accordion data={additionalInformation} />}
      </div>
    </Gutter>
  );
};