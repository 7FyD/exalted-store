"use client";

import React, { useEffect, useState } from "react";

import { Product } from "../../../payload/payload-types";
import { priceFromJSON } from "../../_utilities/priceUtilities";
import { AddToCartButton } from "../AddToCartButton";
import { RemoveFromCartButton } from "../RemoveFromCartButton";

import classes from "./index.module.scss";

export const Price: React.FC<{
  product: Product;
  quantity?: number;
  size?: string;
  button?: "addToCart" | "removeFromCart" | false;
}> = props => {
  const { product, product: { priceJSON } = {}, button = "addToCart", quantity, size } = props;

  const [price, setPrice] = useState<{
    actualPrice: string;
    withQuantity: string;
  }>(() => ({
    actualPrice: priceFromJSON(priceJSON, size),
    withQuantity: priceFromJSON(priceJSON, size, quantity),
  }));

  useEffect(() => {
    setPrice({
      actualPrice: priceFromJSON(priceJSON, size),
      withQuantity: priceFromJSON(priceJSON, size, quantity),
    });
  }, [priceJSON, quantity, size]);

  return (
    <div className={classes.actions}>
      {typeof price?.actualPrice !== "undefined" && price?.withQuantity !== "" && (
        <div className={classes.price}>
          <p>{price?.withQuantity}</p>
          {quantity > 1 && (
            <small className={classes.priceBreakdown}>{`${price.actualPrice} x ${quantity}`}</small>
          )}
        </div>
      )}
      {button && button === "addToCart" && (
        <AddToCartButton size={size} product={product} appearance="default" />
      )}
      {button && button === "removeFromCart" && (
        <RemoveFromCartButton size={size} product={product} />
      )}
    </div>
  );
};
