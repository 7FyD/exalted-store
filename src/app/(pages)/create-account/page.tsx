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
          className="text-4xl mx-14 h-max rounded-full top-10 relative text-black lg:text-white backdrop-blur-md"
          href="/"
        >
          7FyD.dev
        </Link>
      </div>

      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params} />

          <div className={classes.formTitle}>
            <h3>Create Account</h3>
            <Image src="/assets/icons/hand.png" alt="hand" width={30} height={30} />
          </div>

          <p>Please enter details</p>

          <CreateAccountForm />
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: "7FyD Store | Create account",
  description: "Join us and create your account!",
  openGraph: mergeOpenGraph({
    title: "7FyD Store | Create account",
    url: "/create-account",
  }),
};
