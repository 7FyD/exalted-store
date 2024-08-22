"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

import { User } from "../../../../payload/payload-types";
import { AddToCartButton } from "../../../_components/AddToCartButton";
import { Price } from "../../../_components/Price";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../_components/ui/table";
import { useFilter } from "../../../_providers/Filter";
interface PurchasedProductsProps {
  user: User | null;
}

const PurchasedProducts: React.FC<PurchasedProductsProps> = ({ user }) => {
  const { setCategoryFilters } = useFilter();
  return (
    <div>
      <h2 className="text-2xl font-bold mt-4">Purchased Products</h2>
      <p>
        These are the products you have purchased over time. This provides a way for you to access
        digital assets or gated content behind a paywall. This is different from your orders, which
        are directly associated with individual payments.
      </p>
      <div className="mt-8">
        {user?.purchases?.length || 0 > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] hidden md:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Buy again</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user?.purchases?.map((purchase, index) => {
                return (
                  <TableRow key={index}>
                    <Fragment>
                      {typeof purchase === "string" ? (
                        <p>{purchase}</p>
                      ) : (
                        <Fragment>
                          <TableCell className="hidden md:block">
                            <Image
                              width={200}
                              height={200}
                              alt={`${purchase.title}`}
                              src={
                                typeof purchase.meta.image === "string"
                                  ? purchase.meta.image
                                  : purchase.meta.image.url
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Link className="hover:underline" href={`/products/${purchase.slug}`}>
                              {purchase.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 justify-center">
                              {typeof purchase.categories === "string"
                                ? purchase.categories
                                : purchase.categories.map((category, index) => {
                                    return (
                                      <Link
                                        className="hover:underline"
                                        href="/products"
                                        onClick={() =>
                                          setCategoryFilters(
                                            typeof category !== "string" && [category.id],
                                          )
                                        }
                                        key={index}
                                      >
                                        {typeof category !== "string" ? category.title : category}
                                      </Link>
                                    );
                                  })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {<Price button={false} product={purchase} />}
                          </TableCell>
                          <TableCell className="text-right">
                            <AddToCartButton product={purchase} appearance="default" />
                          </TableCell>
                        </Fragment>
                      )}
                    </Fragment>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableCaption>These are all your purchases.</TableCaption>
          </Table>
        ) : (
          <h2 className="font-semibold">You have no purchases.</h2>
        )}
      </div>
    </div>
  );
};

export default PurchasedProducts;
