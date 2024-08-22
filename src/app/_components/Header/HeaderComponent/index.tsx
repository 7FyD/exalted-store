"use client";

import React, { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Header as HeaderType } from "../../../../payload/payload-types";
import { useAuth } from "../../../_providers/Auth";
import { CartLink } from "../../CartLink";
import { Gutter } from "../../Gutter";
import { CMSLink } from "../../Link";
import { Button } from "../../ui/button";

const HeaderComponent: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || [];
  const { user } = useAuth();
  const path = usePathname();
  const currentPath = path.split("/")[1];
  return (
    <Gutter
      className={`flex w-full items-center justify-between border-b-2 text-lg p-4 mb-12 ${
        user === undefined && "!hidden"
      }`}
    >
      <Link className="flex" href="/">
        <Image
          src="/logo-nobg.png"
          alt="A dragon behind a shield on which EK is written"
          width={64}
          height={64}
        />
      </Link>
      <div className="flex items-center gap-8">
        {navItems.map(({ link }, i) => {
          return (
            <CMSLink
              key={i}
              {...link}
              className={`hover:underline ${
                currentPath ===
                  (typeof link.reference.value !== "string" ? link.reference.value.slug : "") &&
                "!underline"
              }`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-8">
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
          // <Button
          //   el="link"
          //   href="/login"
          //   label="Login"
          //   appearance="primary"
          //   className="hover:underline"
          //   onClick={() => {
          //     window.location.href = "/login";
          //   }}
          // />
          <Button asChild className="px-4">
            <Link href="/login">LOGIN</Link>
          </Button>
        )}
      </div>
    </Gutter>
  );
};

export default HeaderComponent;
