import React, { Fragment } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Order as OrderC } from "../../../../payload/payload-types";
import Breadcrumbs from "../../../_components/Breadcrumbs";
import { Button } from "../../../_components/Button";
import { Gutter } from "../../../_components/Gutter";
import { HR } from "../../../_components/HR";
import { Media } from "../../../_components/Media";
import { Price } from "../../../_components/Price";
import { Button as ButtonS } from "../../../_components/ui/button";
import { Separator } from "../../../_components/ui/separator";
import { getMeUser } from "../../../_utilities/getMeUser";
import { mergeOpenGraph } from "../../../_utilities/mergeOpenGraph";

import classes from "./index.module.scss";

export default async function Order({ params: { id } }) {
  const { token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      "You must be logged in to view this order.",
    )}&redirect=${encodeURIComponent(`/order/${id}`)}`,
  });

  let order: OrderC | null = null;

  try {
    order = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    })?.then(async res => {
      if (!res.ok) notFound();
      const json = await res.json();
      if ("error" in json && json.error) notFound();
      if ("errors" in json && json.errors) notFound();
      return json;
    });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  if (!order) {
    notFound();
  }

  const status =
    order.orderDetails.status.charAt(0).toUpperCase() + order.orderDetails.status.slice(1);

  const statusColor =
    status === "Pending"
      ? "text-yellow-500"
      : status === "Paid"
      ? "text-blue-500"
      : "text-emerald-500";

  return (
    <Gutter className={classes.orders}>
      <div className={classes.itemMeta}>
        <Breadcrumbs />
        <p className="text-xl font-medium">{`Order ID: ${order.id}`}</p>
        <p className="text-foreground/60">
          Order date:{" "}
          <span className="text-foreground">
            {new Date(order.createdAt).toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </p>
        <p className={`${statusColor} font-medium !-mt-2`}>
          {`Current order status: ${status}`}
          {status === "Pending" && (
            <>
              {" - "}
              <ButtonS className="p-0" asChild variant="link">
                <Link href={order.stripeCheckoutURL} target="_blank">
                  continue checkout
                </Link>
              </ButtonS>
            </>
          )}
        </p>
      </div>
      <HR />
      <div className={classes.order}>
        <h4 className={classes.orderItems}>Items</h4>
        {order.items?.map((item, index) => {
          if (typeof item.product === "object") {
            const {
              quantity,
              product,
              product: { id, title, meta, stripeProductID },
            } = item;

            const isLast = index === (order?.items?.length || 0) - 1;

            const metaImage = meta?.image;

            return (
              <Fragment key={index}>
                <div className={classes.row}>
                  <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
                    {!metaImage && <span className={classes.placeholder}>No image</span>}
                    {metaImage && typeof metaImage !== "string" && (
                      <Media
                        className={classes.media}
                        imgClassName={classes.image}
                        resource={metaImage}
                        fill
                      />
                    )}
                  </Link>
                  <div className={classes.rowContent}>
                    {!stripeProductID && (
                      <p className={classes.warning}>
                        {"This product is not yet connected to Stripe. To link this product, "}
                        <Link
                          href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/products/${id}`}
                        >
                          edit this product in the admin panel
                        </Link>
                        {"."}
                      </p>
                    )}
                    <h5 className={classes.title}>
                      <Link href={`/products/${product.slug}`} className={classes.titleLink}>
                        {title}
                      </Link>
                    </h5>
                    <p>{`Quantity: ${quantity}`}</p>
                    <Price product={product} button={false} quantity={quantity} />
                  </div>
                </div>
                {!isLast && <HR />}
              </Fragment>
            );
          }

          return null;
        })}
      </div>
      <HR />
      <div className={classes.actions}>
        <Button href="/orders" appearance="primary" label="See all orders" />
        <Button href="/account" appearance="secondary" label="Go to account" />
      </div>
    </Gutter>
  );
}

export async function generateMetadata({ params: { id } }): Promise<Metadata> {
  return {
    title: `Order ${id}`,
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
  };
}
