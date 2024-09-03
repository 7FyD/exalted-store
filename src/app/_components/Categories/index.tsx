import React from "react";
import Link from "next/link";

import { Category } from "../../../payload/payload-types";
import { Button } from "../Button";
import CategoryCard from "./CategoryCard";

import classes from "./index.module.scss";

const Categories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl md:text-4xl font-semibold">Exalted-Kingdom Store</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map(category => {
          return <CategoryCard key={category.id} category={category} />;
        })}
      </div>
    </div>
  );
};

export default Categories;
