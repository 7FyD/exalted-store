import React from "react";
import { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { RenderParams } from "../../_components/RenderParams";
import { mergeOpenGraph } from "../../_utilities/mergeOpenGraph";
import { RecoverPasswordForm } from "./RecoverPasswordForm";

import classes from "./index.module.scss";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: "400",
});

export default async function RecoverPassword() {
  return (
    <section className={classes.recoverPassword}>
      <div className={`${classes.heroImg} ${josefin.className}`}>
        <Link
          className="text-4xl mx-14 top-10 relative"
          href="https://7fyd.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          7FyD.dev (here would be an image)
        </Link>
      </div>

      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params} />

          <Link href="/login" className={classes.backLink}>
            <Image src="/assets/icons/arrow-left.svg" alt="left arrow" width={24} height={24} />
            <p>Back</p>
          </Link>
          <div className={classes.formTitle}>
            <h3>Forgot Password</h3>
          </div>
          <RecoverPasswordForm />
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: "7FyD Store | Recover Password",
  description: "Enter your email address to recover your password.",
  openGraph: mergeOpenGraph({
    title: "7FyD Store | Recover Password",
    url: "/recover-password",
  }),
};
