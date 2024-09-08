"use client";

import * as React from "react";
import Image from "next/image";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

import { Header } from "../../../../payload/payload-types";
import { cn } from "../../../_utilities";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";

interface MobileNavProps {
  header: Header;
}

const MobileNav: React.FC<MobileNavProps> = ({ header }) => {
  const [open, setOpen] = React.useState(false);
  const navItems = header?.navItems || [];
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 border-darkred-600 border-r-[3px]">
        <MobileLink href="/" className="flex items-center gap-3 mb-12" onOpenChange={setOpen}>
          <Image
            src="/logo-nobg.png"
            alt="Exalted Kingdom Logo, a red shield with a white dragon behind it, EK being written on it."
            width={48}
            height={48}
          />
          <span className="font-bold">EK Store</span>
        </MobileLink>
        <div className="flex flex-col space-y-6 text-xl ml-16 font-medium">
          {navItems.map(({ link }, i) => {
            return (
              <div key={link.url}>
                {link.url ? (
                  <MobileLink
                    href={link.url}
                    onOpenChange={!!link.newTab ? () => {} : setOpen}
                    newTab={!!link.newTab}
                  >
                    {link.label}
                  </MobileLink>
                ) : (
                  link.label
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  newTab?: boolean;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  newTab,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        if (!newTab) {
          router.push(href.toString());
          onOpenChange?.(false);
        }
      }}
      className={cn(className)}
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : ""}
      {...props}
    >
      {children}
    </Link>
  );
}

export default MobileNav;
