import React from "react";
import { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { RenderParams } from "../../_components/RenderParams";
import { getMeUser } from "../../_utilities/getMeUser";
import { mergeOpenGraph } from "../../_utilities/mergeOpenGraph";
import CreateAccountForm from "./CreateAccountForm";

import classes from "./index.module.scss";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: "400",
});

export default async function CreateAccount() {
  await getMeUser({
    validUserRedirect: `/account?warning=${encodeURIComponent(
      "Cannot create a new account while logged in, please log out and try again.",
    )}`,
  });

  return (
    <section className={classes.createAccount}>
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

          <p>Please enter details</p>

          <CreateAccountForm />
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: "Exalted Kingdom Store - Create accout",
  description: "Join us and create your account!",
  openGraph: mergeOpenGraph({
    title: "Exalted Kingdom Store - Create account",
    url: "/create-account",
  }),
};
