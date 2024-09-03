import { useState } from "react";
import Image from "next/image";

import { Product } from "../../../../../payload/payload-types";
import { priceNumberFromJSON } from "../../../../_utilities/priceUtilities";
import RankDialog from "../RankDialog";

const RankCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsDialogOpen(true)}
        key={product.id}
        className="flex flex-col gap-4 h-auto text-center p-2 hover:cursor-pointer"
      >
        <Image
          src={typeof product.meta.image === "string" ? product.meta.image : product.meta.image.url}
          alt={`${product.title} Logo`}
          className="mx-auto"
          width={190}
          height={190}
        />
        <h4 className="text-blue-300 text-lg font-semibold">{product.title}</h4>
        <p className="text-sm">
          Receive the {product.title} Rank on the Exalted-Kingdom Minecraft Server and
          Exalted-Kingdom Discord.
        </p>
        {/* TODO: IF PRODUCT HAS DISCOUNT PRICE SHOW THIS IF NOT DONT SHOW IT SIMPLEEEEEEE */}
        <p className="text-destructive line-through">
          {product.priceJSON ? `$${priceNumberFromJSON(product.priceJSON, 1) / 100}` : "$15"}
        </p>
        <p className="mt-[-16px]">
          {product.priceJSON ? `$${priceNumberFromJSON(product.priceJSON, 1) / 100 - 0.01}` : "$10"}
        </p>
      </div>
      <RankDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} product={product} />
    </>
  );
};

export default RankCard;
