"use client";

import { Josefin_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Footer } from "../../../../payload/payload-types";
import { inclusions, noHeaderFooterUrls } from "../../../constants";
import { Gutter } from "../../Gutter";
import { CMSLink } from "../../Link";

import classes from "./index.module.scss";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: "400",
});

// TODO: revamp footer

const FooterComponent = ({ footer }: { footer: Footer }) => {
  const pathname = usePathname();

  const navItems = footer?.navItems || [];
  return (
    <footer className={`${noHeaderFooterUrls.includes(pathname) ? classes.hide : ""} mt-8`}>
      <div className={classes.footer}>
        <Gutter>
          <div className={classes.wrap}>
            <div>
              <Link href="/">
                <p className={`${josefin.className} text-3xl text-white`}>7FyD.dev</p>
              </Link>

              <p>{footer?.copyright}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(({ link }) => {
                return (
                  <CMSLink className="text-white hover:underline" key={link.label} {...link} />
                );
              })}
            </div>
          </div>
        </Gutter>
      </div>
    </footer>
  );
};

export default FooterComponent;
