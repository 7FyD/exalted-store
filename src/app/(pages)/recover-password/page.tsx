import React from "react";
import { ArrowLeftCircle } from "lucide-react";
import { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
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

          <Link href="/login" className={[classes.backLink, "space-x-2"].join(" ")}>
            <ArrowLeftCircle />
            <p>back to login</p>
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
  title: "Exalted Kingdom Store - Recover Password",
  description: "Enter your email address to recover your password.",
  openGraph: mergeOpenGraph({
    title: "Exalted Kingdom Store - Recover Password",
    url: "/recover-password",
  }),
};
