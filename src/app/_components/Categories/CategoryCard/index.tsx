"use client";

import Link from "next/link";

import { Category } from "../../../../payload/payload-types";
import { useFilter } from "../../../_providers/Filter";

import classes from "./index.module.scss";

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
      className={`flex justify-center items-end w-full min-h-64 bg-40% bg-center bg-no-repeat border-2 transition-shadow duration-300 ease-in-out shadow hover:!shadow-yellow-600`}
      style={{ backgroundImage: `url(${imageUrl})` }}
      onClick={() => setCategoryFilters([category.id])}
    >
      <p className="text-2xl text-yellow-600 pb-4">{category.title}</p>
    </Link>
  );
};

export default CategoryCard;
