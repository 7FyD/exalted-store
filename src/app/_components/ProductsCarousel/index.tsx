"use client";

import { Product } from "../../../payload/payload-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselOptions,
  CarouselPrevious,
} from "../ui/carousel";
import ProductCard from "./ProductCard";

interface ProductsCarouselInterface {
  products: Product[] | null;
  options?: CarouselOptions;
}

const ProductsCarousel: React.FC<ProductsCarouselInterface> = ({ products, options }) => {
  return (
    <Carousel
      opts={options}
      className="w-5/6 mx-auto
    "
    >
      <CarouselContent className="-ml-1 space-x-2">
        {products?.map((item, index) => {
          let url = "",
            image = item.meta.image;
          if (typeof image === "string") {
            url = image;
          } else {
            url = image.url;
          }
          return (
            <CarouselItem className="px-6 py-4 sm:basis-1/2 lg:basis-1/3" key={item.slug}>
              <ProductCard
                slug={item.slug}
                title={item.title}
                imageUrl={url}
                categories={item.categories}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="mx-2 sm:mx-0" />
      <CarouselNext className="mx-2 sm:mx-0" />
    </Carousel>
  );
};

export default ProductsCarousel;
