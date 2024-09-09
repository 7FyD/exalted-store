"use client";

import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { HR } from "../HR";

const Breadcrumbs: React.FC<{ showHR?: boolean }> = ({ showHR = false }) => {
  const path = usePathname();
  let pathArray = ["home", ...path.split("/").filter(item => item !== "")];

  const createPath = (index: number) => {
    if (index === 0) return "";
    return pathArray.slice(1, index + 1).join("/");
  };

  const formatPath = (path: string) => {
    if (path.length === 24) return "ID " + path;
    return path.slice(0, 1).toUpperCase() + path.slice(1);
  };

  //TODO: mobile add responsivity

  return (
    <div>
      <div className="hidden md:!flex items-center gap-2 text-foreground/90 text-lg">
        {pathArray.map((path, index) => {
          return (
            <Fragment key={index}>
              {index > 0 && <ChevronRight className="size-5 text-foreground/40" />}
              <Link className="hover:underline underline-offset-4" href={`/${createPath(index)}`}>
                {formatPath(path)}
              </Link>
            </Fragment>
          );
        })}
      </div>
      {showHR && <HR className="!my-4" />}
    </div>
  );
};

export default Breadcrumbs;
