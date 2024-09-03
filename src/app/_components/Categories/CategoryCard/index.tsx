"use client";

import Link from "next/link";

import { Category } from "../../../../payload/payload-types";
import { useFilter } from "../../../_providers/Filter";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  let imageUrl =
    (category.media && typeof category.media !== "string" && category.media.url) || "/missing.png";
  const { setCategoryFilters } = useFilter();
  return (
    <Link
      href={`category/${category.title.toLowerCase()}`}
      className={`${
        category.title === "cosmetics" ? "lg:!col-[4_/_span_2]" : "lg:!col-span-2"
      } col-span-1 sm:!col-span-2 flex justify-center items-end w-full min-h-64 bg-40% bg-center bg-no-repeat border-2 border-[#751729] transition-shadow duration-300 ease-in-out shadow hover:!shadow-[#500718] hover:shadow-lg`}
      style={{ backgroundImage: `url(${imageUrl})` }}
      onClick={() => setCategoryFilters([category.id])}
    >
      <p className="text-2xl text-[#711728] pb-4">
        {category.title.charAt(0).toUpperCase() + category.title.slice(1)}
      </p>
    </Link>
  );
};

export default CategoryCard;
