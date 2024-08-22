"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Header as HeaderType } from "../../../../payload/payload-types";
import { useAuth } from "../../../_providers/Auth";
import { Button } from "../../Button";
import { CartLink } from "../../CartLink";
import { CMSLink } from "../../Link";

import classes from "./index.module.scss";

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || [];
  const { user } = useAuth();
  const path = usePathname();
  const currentPath = path.split("/")[1];
  return (
    <div
      className={`flex justify-between  ${[classes.nav, user === undefined && classes.hide]
        .filter(Boolean)
        .join(" ")}`}
    >
      <div>
        {navItems.map(({ link }, i) => {
          return (
            <CMSLink
              key={i}
              {...link}
              appearance="none"
              className={`hover:underline ${
                currentPath ===
                  (typeof link.reference.value !== "string" ? link.reference.value.slug : "") &&
                "!underline"
              }`}
            />
          );
        })}
      </div>
      <div>
        <CartLink className={`hover:underline ${currentPath === "cart" && "!underline"}`} />
        {user && (
          <Fragment>
            <Link
              href="/account"
              className={`hover:underline ${currentPath === "account" && "!underline"}`}
            >
              Account
            </Link>
            <Link href="/logout" className={`hover:underline`}>
              Logout
            </Link>
          </Fragment>
        )}
        {!user && (
          <Button
            el="link"
            href="/login"
            label="Login"
            appearance="primary"
            className="hover:underline"
            onClick={() => {
              window.location.href = "/login";
            }}
          />
        )}
      </div>
    </div>
  );
};
