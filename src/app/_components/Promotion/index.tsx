import { Product } from "../../../payload/payload-types";
import ProductsCarousel from "../ProductsCarousel";

interface PromotionProps {
  products: Product[] | null;
}

const Promotion: React.FC<PromotionProps> = ({ products }) => {
  return (
    <div className="flex flex-col items-center mb-16">
      <h2 className="text-center w-full bg-black text-white text-xl md:text-4xl font-bold py-2 md:py-6 mb-6">
        CHECK OUT OUR NEWEST PRODUCTS
      </h2>
      <ProductsCarousel products={products} options={{ align: "start", loop: true }} />
    </div>
  );
};

export default Promotion;
