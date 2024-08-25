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

  if (isLoading) return <p>Loading...</p>;
  if (error || !data || data.length < 1)
    return (
      <p className="text-center font-semibold">
        Error loading ranks :( please contact our server administrator (contact link)
      </p>
    );

  const products: Product[] = data;

  return (
    <Gutter>
      <h2 className="text-2xl font-semibold">Server ranks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 items-center">
        {products.map(RankCard)}
      </div>
    </Gutter>
  );
};

export default RanksPage;
