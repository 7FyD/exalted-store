import React, { Fragment } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { Button } from "../../_components/ui/button";
import { Card, CardContent } from "../../_components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../_components/ui/tabs";
import { getMeUser } from "../../_utilities/getMeUser";
import { mergeOpenGraph } from "../../_utilities/mergeOpenGraph";
import AccountForm from "./AccountForm";
import PurchasedProducts from "./PurchasedProducts";

export default async function Account() {
  const { user } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      "You must be logged in to access your account.",
    )}&redirect=${encodeURIComponent("/account")}`,
  });

  return (
    <Fragment>
      <Tabs defaultValue="account" className="w-4/5 mx-auto">
        <TabsList className="grid w-full h-auto grid-cols-1 md:grid-cols-3 mb-24 md:mb-0">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="purchasedProducts">Purchased products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <Card className="mt-8">
          <CardContent>
            <TabsContent value="account">
              <AccountForm />
            </TabsContent>
            <TabsContent value="purchasedProducts">
              <PurchasedProducts user={user} />
            </TabsContent>
            <TabsContent
              value="orders"
              className="flex flex-col justify-center items-center gap-4 m-6"
            >
              <p className="text-lg">
                To see a list of your previous orders, click the button below
              </p>
              <Link
                href="/orders"
                target="_blank"
                rel="noreferrer noopener"
                className="mx-auto block"
              >
                <Button
                  className="p-6 bg-gray-300/50 text-black hover:bg-gray-300/30"
                  variant="default"
                >
                  VIEW YOUR ORDERS
                </Button>
              </Link>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      {/* <Gutter>
        <RenderParams className={classes.params} />
      </Gutter>
      <Gutter className={classes.account}>
        <AccountForm />
        <HR />
        <h2>Purchased Products</h2>
        <p>
          These are the products you have purchased over time. This provides a way for you to access
          digital assets or gated content behind a paywall. This is different from your orders,
          which are directly associated with individual payments.
        </p>
        <div>
          {user?.purchases?.length || 0 > 0 ? (
            <ul className={classes.purchases}>
              {user?.purchases?.map((purchase, index) => {
                return (
                  <li key={index} className={classes.purchase}>
                    {typeof purchase === "string" ? (
                      <p>{purchase}</p>
                    ) : (
                      <h4>
                        <Link href={`/products/${purchase.slug}`}>{purchase.title}</Link>
                      </h4>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={classes.noPurchases}>You have no purchases.</div>
          )}
        </div>
        <HR />
        <h2>Orders</h2>
        <p>
          These are the orders you have placed over time. Each order is associated with an payment
          intent. As you order products, they will appear in your "purchased products" list.
        </p>
        <Button
          className={classes.ordersButton}
          href="/orders"
          appearance="primary"
          label="View orders"
        />
        <HR />
        <Button href="/logout" appearance="secondary" label="Log out" />
      </Gutter> */}
    </Fragment>
  );
}

export const metadata: Metadata = {
  title: "7FyD Store | Account",
  description: "See your account",
  openGraph: mergeOpenGraph({
    title: "7FyD Store | Account",
    url: "/account",
  }),
};
