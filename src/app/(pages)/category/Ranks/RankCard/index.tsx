import Image from "next/image";

import { Product } from "../../../../../payload/payload-types";
import { AddToCartButton } from "../../../../_components/AddToCartButton";

const RankCard = (product: Product, index: number) => (
  <div
    key={product.id}
    className="flex flex-col gap-4 bg-50% bg-top bg-no-repeat h-auto border-2 text-center p-2"
  >
    <Image
      src={typeof product.meta.image === "string" ? product.meta.image : product.meta.image.url}
      alt={`${product.title} Logo`}
      className="mx-auto"
      width={190}
      height={190}
    />
    <h4 className="text-blue-300 text-lg font-semibold">{product.title}</h4>
    <p className="text-sm">{product.additionalInformation[0]?.message}</p>
    <p className="text-destructive line-through">
      $15{/* {(parseFloat(product.priceJSON) * 1.28).toFixed(2)} */}
    </p>
    <p className="mt-[-16px]">$10 {/* {product.priceJSON} */}</p>
    <AddToCartButton className="max-w-[50%] mx-auto" product={product} />
  </div>
);

export default RankCard;
