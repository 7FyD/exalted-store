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
                <p className={`${josefin.className} text-xl text-white`}>Exalted-Kingdom</p>
              </Link>

              <p className="text-sm font-light">{footer?.copyright}</p>
            </div>
            <div className="flex flex-row gap-2 md:gap-4 ">
              {navItems.map(({ link }) => {
                return (
                  <div key={link.url} className="flex justify-center items-center">
                    <CMSLink className="text-white hover:underline" key={link.label} {...link} />
                  </div>
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
