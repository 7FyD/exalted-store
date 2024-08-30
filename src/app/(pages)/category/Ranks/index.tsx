"use client";

import { useQuery } from "@tanstack/react-query";

import { Product } from "../../../../payload/payload-types";
import { Gutter } from "../../../_components/Gutter";
import { fetchProducts } from "../../../_lib/fetch-products";
import RankCard from "./RankCard";

const RanksPage = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products", "ranks"],
    queryFn: () => fetchProducts("ranks"),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <Gutter className="text-center">
        <p className="font-semibold">Loading...</p>
      </Gutter>
    );
  if (error || !data || data.length < 1)
    return (
      <Gutter className="text-center">
        <p className="font-semibold">
          Error loading ranks :( please contact our server administrator (contact link)
        </p>
      </Gutter>
    );

  const products: Product[] = data;

  return (
    <Gutter className="space-y-8  text-center md:text-start">
      <h2 className="text-2xl font-semibold">Server ranks</h2>
      <p className="text-muted-foreground !mt-0">
        These are the ranks that are available for purchase on our server.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 items-center">
        {products.map((product, index) => {
          return <RankCard key={index} product={product} index={index} />;
        })}
      </div>
    </Gutter>
  );
};

export default RanksPage;
