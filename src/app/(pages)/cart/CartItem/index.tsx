"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Media } from "../../../_components/Media";
import { Price } from "../../../_components/Price";
import { RemoveFromCartButton } from "../../../_components/RemoveFromCartButton";

import classes from "./index.module.scss";

const CartItem = ({ product, title, metaImage, addItemToCart, showPrice = true }) => {
  return (
    <li className={classes.item} key={title}>
      <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
        {!metaImage && <span>No image</span>}
        {metaImage && typeof metaImage !== "string" && (
          <Media className={classes.media} imgClassName={classes.image} resource={metaImage} fill />
        )}
      </Link>

      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <div className="flex flex-col items-center md:items-start">
            <h6>{title}</h6>
          </div>
          {showPrice && <Price product={product} button={false} />}
        </div>
      </div>

      <div className={[classes.subtotalWrapper, "justify-center md:!justify-end"].join(" ")}>
        <Price product={product} button={false} />
        <RemoveFromCartButton product={product} />
      </div>
    </li>
  );
};

export default CartItem;
