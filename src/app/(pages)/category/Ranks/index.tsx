"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { Product } from "../../../../payload/payload-types";
import { Gutter } from "../../../_components/Gutter";
import { fetchProducts } from "../../../_lib/fetch-products";

const RanksPage = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products", "ranks"],
    queryFn: () => fetchProducts("ranks"),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !data || data.length < 1)
    return (
      <p className="text-center font-semibold">
        Error loading ranks :( please contract our server administrator (contact link)
      </p>
    );

  const products: Product[] = data;

  console.log(products); // dev only

  return (
    <Gutter>
      <h2 className="text-2xl font-semibold">Server ranks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 items-center">
        <div
          className="flex flex-col gap-4 bg-50% bg-top bg-no-repeat h-auto border-2 text-center p-2"
          // style={{ backgroundImage: `url(/media/mvp-plus.png)` }}
        >
          <Image
            src="/media/mvp-plus.png"
            alt="MVP+ Logo"
            className="mx-auto"
            width={190}
            height={190}
          />
          <h4 className="text-blue-300 text-lg font-semibold">MVP+</h4>
          <p className="text-sm">
            Enjoy small quality of life benefits and support the server! Receive this rank on our
            factions minecraft server and on the discord server
          </p>
          <p className="text-destructive line-through">$8.32</p>
          <p className="mt-[-16px]">$6.50</p>
        </div>
        <div
          className="flex flex-col gap-4 bg-50% bg-top bg-no-repeat h-auto border-2 text-center p-2"
          // style={{ backgroundImage: `url(/media/mvp-plus.png)` }}
        >
          <Image
            src={
              typeof products[0].meta.image === "string"
                ? products[0].meta.image
                : products[0].meta.image.url
            }
            alt={`${products[0].title} Logo`}
            className="mx-auto"
            width={190}
            height={190}
          />
          <h4 className="text-blue-300 text-lg font-semibold">{products[0].title}+</h4>
          <p className="text-sm">{products[0].additionalInformation[0].message}</p>
          <p className="text-destructive line-through">$8.32</p>
          <p className="mt-[-16px]">{products[0].priceJSON}</p>
        </div>
      </div>
    </Gutter>
  );
};

export default RanksPage;
