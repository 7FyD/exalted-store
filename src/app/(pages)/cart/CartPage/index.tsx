"use client";

import React, { Fragment, useState } from "react";
import { MoonLoader } from "react-spinners";
import Link from "next/link";

import { createOrder } from "../../../../app/_lib/create-pending-order";
import { createCheckoutSession } from "../../../../payload/endpoints/create-checkout-session";
import { Coupon, Page, Settings } from "../../../../payload/payload-types";
import { LoadingShimmer } from "../../../_components/LoadingShimmer";
import { Button } from "../../../_components/ui/button";
import { Input } from "../../../_components/ui/input";
import { useToast } from "../../../_components/ui/use-toast";
import { useAuth } from "../../../_providers/Auth";
import { useCart } from "../../../_providers/Cart";
import AccountModal, { Account } from "../AccountModal";
import CartItem from "../CartItem";
import { checkCoupon } from "../HandleCoupon";

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
  const [coupon, setCoupon] = useState<string>("");
  const [validCoupon, setValidCoupon] = useState<Coupon>(null!);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart, clearCart } = useCart();

  const handleCouponApply = async () => {
    setIsCouponLoading(true);
    await checkCoupon(coupon)
      .then(data => {
        if ("success" in data && data.foundCoupon) {
          console.log(data.foundCoupon);
          setValidCoupon(data.foundCoupon);
          toast({
            title: "Coupon applied",
            description: "Your coupon has been applied.",
            variant: "default",
          });
        } else {
          toast({
            title: "Coupon is invalid",
            description: "Please check your coupon and try again.",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setIsCouponLoading(false);
      });
  };

  const handleCouponReset = () => {
    setValidCoupon(null);
    setCoupon("");
  };

  const formatTotal = (total: number): string => {
    return (total / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const handleAccountUpdate = (newAccount: Account | null) => {
    setAccount(newAccount);
  };

  const checkout = React.useCallback(async () => {
    if (user && account) {
      setIsLoading(true);
      const response = await createCheckoutSession(cart.items, user?.email, validCoupon?.id);
      if (response.url && response.stripeCheckoutSessionID) {
        const newOrder = await createOrder(
          cart.items,
          user.email,
          account.name,
          response.stripeCheckoutSessionID,
          response.url,
          validCoupon,
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
  }, [cart.items, user?.email, account, validCoupon]);

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
                {/* CART LIST HEADER */}
                <div className={[classes.summary, "rounded-xl"].join(" ")}>
                  <div className={classes.header}>
                    <p>Products</p>
                    <p className={classes.headersubtotal}>Price</p>
                    <p className={classes.headersubtotal}>Actions</p>
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
                  <Button className="mb-4 max-w-fit ml-auto" onClick={clearCart}>
                    Clear cart
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className={`rounded-xl ${classes.summary}`}>
                  <div className={classes.row}>
                    <h6 className={classes.cartTotal}>Summary</h6>
                  </div>
                  {validCoupon && (
                    <Fragment>
                      <div className={classes.row}>
                        <p className={classes.cartTotal}>Total price</p>
                        <p className={classes.cartTotal}>{cartTotal.formatted}</p>
                      </div>
                      <div className={classes.row}>
                        <p className={classes.cartTotal}>Coupon "{validCoupon.name}"</p>
                        <p className={[classes.cartTotal, "text-red-500"].join(" ")}>
                          - {formatTotal(cartTotal.raw * (validCoupon.discount / 100))}
                        </p>
                      </div>
                    </Fragment>
                  )}
                  <div className={classes.row}>
                    <p className={classes.cartTotal}>Grand total</p>
                    <p className={classes.cartTotal}>
                      {validCoupon
                        ? formatTotal(cartTotal.raw - cartTotal.raw * (validCoupon.discount / 100))
                        : cartTotal.formatted}
                    </p>
                  </div>
                  <div className={classes.row}></div>
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
                <div className={`rounded-xl ${classes.summary}`}>
                  <div className={classes.row}>
                    <h6 className={classes.cartTotal}>Do you have a coupon or a referral code?</h6>
                  </div>
                  <div className={`${classes.row} gap-8`}>
                    <Input
                      disabled={isCouponLoading || !!validCoupon}
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                    />
                    {!validCoupon ? (
                      <Button
                        className={[classes.label, "px-8"].join(" ")}
                        onClick={handleCouponApply}
                        disabled={isCouponLoading}
                      >
                        {isCouponLoading ? <MoonLoader size={20} color="#ffffff" /> : "Apply"}
                      </Button>
                    ) : (
                      <Button
                        className={[classes.label, "px-8"].join(" ")}
                        onClick={handleCouponReset}
                        disabled={isCouponLoading}
                      >
                        {isCouponLoading ? <MoonLoader size={20} color="#ffffff" /> : "Reset"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
