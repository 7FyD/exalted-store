"use client";

import React, { Fragment } from "react";
import Link from "next/link";

import { createCheckoutSession } from "../../../../payload/endpoints/create-checkout-session";
import { Page, Settings } from "../../../../payload/payload-types";
import { Button } from "../../../_components/Button";
import { LoadingShimmer } from "../../../_components/LoadingShimmer";
import { useAuth } from "../../../_providers/Auth";
import { useCart } from "../../../_providers/Cart";
import CartItem from "../CartItem";

import classes from "./index.module.scss";

export const CartPage: React.FC<{
  settings: Settings;
  page: Page;
}> = props => {
  const { settings } = props;
  const { productsPage } = settings || {};

  const { user } = useAuth();
  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart, clearCart } = useCart();
  const checkout = React.useCallback(async () => {
    if (user) {
      const response = await createCheckoutSession(cart.items, user?.email);

      if (response.url) {
        window.location.href = response.url;
      }
    } else {
      console.error("Failed to create checkout session.");
    }
  }, [cart.items, user?.email]);
  return (
    <Fragment>
      <br />
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={classes.empty}>
              Your cart is empty.
              {!user && (
                <Fragment>
                  {" "}
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.cartWrapper}>
              <div>
                <Button
                  className="mb-4"
                  appearance="primary"
                  label="Clear cart"
                  el="button"
                  onClick={clearCart}
                />
                {/* CART LIST HEADER */}
                <div className={classes.header}>
                  <p>Products</p>
                  <div className={classes.headerItemDetails}>
                    <p></p>
                    <p></p>
                    <p>Quantity</p>
                  </div>
                  <p className={classes.headersubtotal}>Subtotal</p>
                </div>
                {/* CART ITEM LIST */}
                <ul className={`${classes.itemsList}`}>
                  {cart?.items?.map((item, index) => {
                    if (typeof item.product === "object") {
                      const {
                        quantity,
                        product,
                        product: { id, title, meta, stripeProductID },
                        size,
                      } = item;
                      const isLast = index === (cart?.items?.length || 0) - 1;

                      const metaImage = meta?.image;

                      return (
                        <CartItem
                          product={product}
                          title={title}
                          metaImage={metaImage}
                          qty={quantity}
                          size={size}
                          addItemToCart={addItemToCart}
                          key={index}
                          showPrice={false}
                        />
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>

              <div className={classes.summary}>
                <div className={classes.row}>
                  <h6 className={classes.cartTotal}>Summary</h6>
                </div>

                {/* <div className={classes.row}>
                  <p className={classes.cartTotal}>Products</p>
                  <p className={classes.cartTotal}>
                    €{((cartTotal.raw - (cartTotal.raw / 100) * 19) / 100).toFixed(2)}
                  </p>
                </div>

                <div className={classes.row}>
                  <p className={classes.cartTotal}>Tax</p>
                  <p className={classes.cartTotal}>
                    €{((cartTotal.raw / 100 / 100) * 19).toFixed(2)}
                  </p>
                </div> */}

                <div className={classes.row}>
                  <p className={classes.cartTotal}>Grand Total</p>
                  <p className={classes.cartTotal}>{cartTotal.formatted}</p>
                </div>
                {!user && (
                  <Button
                    className={classes.checkoutButton}
                    href="/login?redirect=cart"
                    label="Login to checkout"
                    appearance="primary"
                  />
                )}
                {user && (
                  <Fragment>
                    <Button
                      className={classes.checkoutButton}
                      href={user ? "/checkout" : "/login?redirect=cart"}
                      label={user ? "Checkout" : "Login to checkout"}
                      appearance="primary"
                    />
                    <Button
                      className={classes.checkoutButton}
                      onClick={checkout}
                      label={user ? "Stripe checkout" : "Login to checkout"}
                      appearance="secondary"
                    />
                  </Fragment>
                )}
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
