import Image from "next/image";
import Link from "next/link";

import { Category } from "../../../../payload/payload-types";
import { Card, CardContent } from "../../ui/card";

interface ProductCardProps {
  slug: string;
  title: string;
  categories: (string | Category)[];
  imageUrl: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ slug, title, categories, imageUrl }) => {
  return (
    <Link href={`/products/${slug}`} target="_blank" rel="noopener noreferrer" key={slug}>
      <Card className="hover:scale-105 transition-transform h-full">
        <CardContent className="flex flex-col items-stars">
          <Image className="mx-auto" src={imageUrl} width={300} height={300} alt={title} />
          {categories?.map(category => {
            return (
              <h2
                className="font-semibold"
                key={typeof category === "string" ? category : category.id}
              >
                {typeof category === "string" ? category : category.title}
              </h2>
            );
          })}
          <h4>{title}</h4>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
