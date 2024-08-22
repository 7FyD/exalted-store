"use client";

import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";

import { Product } from "../../../payload/payload-types";
import { countPricesFromJSON } from "../../_utilities/priceUtilities";
import { Media } from "../Media";
import { Price } from "../Price";

import classes from "./index.module.scss";

export const Card: React.FC<{
  alignItems?: "center";
  className?: string;
  showCategories?: boolean;
  hideImagesOnMobile?: boolean;
  title?: string;
  relationTo?: "products";
  doc?: Product;
  showPrice?: boolean;
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, meta, priceJSON } = {},
    className,
    showPrice = true,
  } = props;

  const { description, image: metaImage } = meta || {};
  const prices = countPricesFromJSON(priceJSON);
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0;
  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, " "); // replace non-breaking space with white space
  const href = `/products/${slug}`;
  return (
    <div className={`${[classes.card, className].filter(Boolean).join(" ")} !h-[350px]`}>
      <Link href={href} className={classes.mediaWrapper}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== "string" && (
          <Media imgClassName="object-contain w-4/5 mx-auto" resource={metaImage} />
        )}
      </Link>
      <div className={classes.content}>
        {showCategories && hasCategories && (
          <div className={classes.leader}>
            {showCategories && hasCategories && (
              <div>
                {categories?.map((category, index) => {
                  if (typeof category === "object" && category !== null) {
                    const { title: titleFromCategory } = category;

                    const categoryTitle = titleFromCategory || "Untitled category";

                    const isLast = index === categories.length - 1;

                    return (
                      <Fragment key={index}>
                        {categoryTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        )}
        {titleToUse && (
          <h4 className={classes.title}>
            <Link href={href} className={`${classes.titleLink} font-[500]`}>
              {titleToUse}
            </Link>
          </h4>
        )}
        {showPrice && (
          <div className="flex flex-row gap-1">
            {prices > 1 && <p className="w-max font-light">Starting from</p>}
            {doc && <Price size={doc.sizes[0].size} product={doc} button={false} />}
          </div>
        )}
      </div>
    </div>
  );
};
