"use client";

import React, { Fragment, useState } from "react";
import { MoonLoader } from "react-spinners";
import Link from "next/link";

import { createOrder } from "../../../../app/_lib/create-pending-order";
import { createCheckoutSession } from "../../../../payload/endpoints/create-checkout-session";
import { Page, Settings } from "../../../../payload/payload-types";
import { LoadingShimmer } from "../../../_components/LoadingShimmer";
import { Button } from "../../../_components/ui/button";
import { useToast } from "../../../_components/ui/use-toast";
import { useAuth } from "../../../_providers/Auth";
import { useCart } from "../../../_providers/Cart";
import AccountModal, { Account } from "../AccountModal";
import CartItem from "../CartItem";

import classes from "./index.module.scss";

export const CartPage: React.FC<{
  settings: Settings;
  page: Page;
  account: Account | null;
}> = props => {
  const { settings, account: initialAccount } = props;
  const [account, setAccount] = useState<Account | null>(initialAccount);
  const { productsPage } = settings || {};
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart, clearCart } = useCart();

  const checkout = React.useCallback(async () => {
    if (user && account) {
      setIsLoading(true);
      const response = await createCheckoutSession(cart.items, user?.email);
      if (response.url && response.stripeCheckoutSessionID) {
        const newOrder = await createOrder(
          cart.items,
          user.email,
          account.name,
          response.stripeCheckoutSessionID,
          response.url,
        );
        if (newOrder.success) {
          window.location.href = response.url;
        } else {
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            variant: "destructive",
          });
        }
      }
      setIsLoading(false);
    } else {
      console.error("Failed to create checkout session.");
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.items, user?.email, account]);

  const handleAccountUpdate = (newAccount: Account | null) => {
    setAccount(newAccount);
  };

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
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.cartWrapper}>
              <div>
                <div className="flex flex-row gap-4 items-center">
                  <Button className="mb-4" onClick={clearCart}>
                    Clear cart
                  </Button>
                </div>
                {/* CART LIST HEADER */}
                <div className={classes.header}>
                  <p>Products</p>
                  <div className={classes.headerItemDetails}>
                    {/* TODO: remove quantity from all products and cart */}
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
                      } = item;
                      const isLast = index === (cart?.items?.length || 0) - 1;

                      const metaImage = meta?.image;

                      return (
                        <CartItem
                          product={product}
                          title={title}
                          metaImage={metaImage}
                          qty={quantity}
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
                <div className={classes.row}>
                  <p className={classes.cartTotal}>Grand Total</p>
                  <p className={classes.cartTotal}>{cartTotal.formatted}</p>
                </div>
                {!user && (
                  <Button className={classes.checkoutButton} variant="default" asChild>
                    <Link href="/login?redirect=cart">Login to checkout</Link>
                  </Button>
                )}
                {user && (
                  <Fragment>
                    <Fragment>
                      {account && (
                        <Button
                          className={[classes.checkoutButton, classes.label].join(" ")}
                          onClick={checkout}
                          variant="default"
                          disabled={isLoading}
                        >
                          {isLoading ? <MoonLoader size={20} color="#ffffff" /> : "Checkout"}
                        </Button>
                      )}
                      <AccountModal account={account} onAccountUpdate={handleAccountUpdate} />
                    </Fragment>
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
