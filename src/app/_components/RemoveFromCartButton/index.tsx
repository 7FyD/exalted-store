import React from "react";

import { Product } from "../../../payload/payload-types";
import { useCart } from "../../_providers/Cart";
import { Button } from "../ui/button";

import classes from "./index.module.scss";

export const RemoveFromCartButton: React.FC<{
  className?: string;
  product: Product;
  hideIfNotInCart?: boolean;
}> = props => {
  const { className, product, hideIfNotInCart } = props;

  const { deleteItemFromCart, isProductInCart } = useCart();

  const productIsInCart = isProductInCart(product);

  if (hideIfNotInCart && !productIsInCart) {
    return null;
  }

  if (!productIsInCart) {
    return <div>Item is not in the cart</div>;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        deleteItemFromCart(product);
      }}
      className={[className, classes.removeFromCartButton].filter(Boolean).join(" ")}
    >
      Remove from cart
    </Button>
  );
};
