"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Gutter } from "../Gutter";

import classes from "./index.module.scss";

const Breadcrumbs = () => {
  const path = usePathname();
  let pathArray = path.split("/").filter(item => item !== "");
  return (
    <Gutter className={classes.mainContainer}>
      {pathArray.map((path, index) => (
        <Fragment key={index}>
          {index > 0 && <span className={classes.separator}>/</span>}
          {path === "products" ? (
            <Link href={"/" + path}>{path}</Link>
          ) : (
            <Link href={"/products/" + path}>{path}</Link>
          )}
        </Fragment>
      ))}
    </Gutter>
  );
};

export default Breadcrumbs;
