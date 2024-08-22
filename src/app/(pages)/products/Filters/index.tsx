"use client";

import { Category } from "../../../../payload/payload-types";
import { Checkbox } from "../../../_components/Checkbox";
import { RadioButton } from "../../../_components/Radio";
import { Separator } from "../../../_components/ui/separator";
import { useMediaQuery } from "../../../_hooks/use-media-query";
import { useFilter } from "../../../_providers/Filter";

import classes from "./index.module.scss";

const Filters = ({ categories }: { categories: Category[] }) => {
  const { categoryFilters, sort, setCategoryFilters, setSort } = useFilter();
  const handleCategories = (categoryId: string) => {
    if (categoryFilters.includes(categoryId)) {
      const updatedCategories = categoryFilters.filter(id => id !== categoryId);

      setCategoryFilters(updatedCategories);
    } else {
      setCategoryFilters([...categoryFilters, categoryId]);
    }
  };

  const isMediumScreen = useMediaQuery("(min-width: 768px)");

  const handleSort = (value: string) => setSort(value);

  return (
    <div className={`${classes.filters} overflow-y-hidden`}>
      <div className={`flex ${isMediumScreen ? "flex-col gap-6" : "flex-row gap-8"} px-2`}>
        <div>
          <h6 className={classes.title}>Product Categories</h6>
          <div className={classes.categories}>
            {categories.map(category => {
              const isSelected = categoryFilters.includes(category.id);

              return (
                <Checkbox
                  key={category.id}
                  label={category.title}
                  value={category.id}
                  isSelected={isSelected}
                  onClickHandler={handleCategories}
                />
              );
            })}
          </div>
        </div>
        <Separator orientation={isMediumScreen ? "horizontal" : "vertical"} />
        <div>
          <h6 className={classes.title}>Sort By</h6>
          <div className={classes.categories}>
            <RadioButton
              label="Latest"
              value="-createdAt"
              isSelected={sort === "-createdAt"}
              onRadioChange={handleSort}
              groupName="sort"
            />
            <RadioButton
              label="Oldest"
              value="createdAt"
              isSelected={sort === "createdAt"}
              onRadioChange={handleSort}
              groupName="sort"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
