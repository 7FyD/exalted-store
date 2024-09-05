"use client";

import React, { useEffect, useState } from "react";

import { Product } from "../../../payload/payload-types";
import { priceFromJSON } from "../../_utilities/priceUtilities";
import { AddToCartButton } from "../AddToCartButton";
import { RemoveFromCartButton } from "../RemoveFromCartButton";

import classes from "./index.module.scss";

export const Price: React.FC<{
  product: Product;
  button?: "addToCart" | "removeFromCart" | false;
}> = props => {
  const { product, product: { priceJSON } = {}, button = "addToCart" } = props;

  const [price, setPrice] = useState<{
    actualPrice: string;
  }>(() => ({
    actualPrice: priceFromJSON(priceJSON),
  }));

  useEffect(() => {
    setPrice({
      actualPrice: priceFromJSON(priceJSON),
    });
  }, [priceJSON]);

  return (
    <div className={classes.actions}>
      {typeof price?.actualPrice !== "undefined" && (
        <div className={classes.price}>
          <p>{price?.actualPrice}</p>
        </div>
      )}
      {button && button === "addToCart" && (
        <AddToCartButton product={product} appearance="default" />
      )}
      {button && button === "removeFromCart" && <RemoveFromCartButton product={product} />}
    </div>
  );
};
