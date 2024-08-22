import React from "react";
import { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { RenderParams } from "../../_components/RenderParams";
import { getMeUser } from "../../_utilities/getMeUser";
import { mergeOpenGraph } from "../../_utilities/mergeOpenGraph";
import LoginForm from "./LoginForm";

import classes from "./index.module.scss";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: "400",
});

export default async function Login() {
  await getMeUser({
    validUserRedirect: `/account?warning=${encodeURIComponent("You are already logged in.")}`,
  });

  return (
    <section className={classes.login}>
      <div className={`${classes.heroImg} ${josefin.className}`}>
        <Link className="text-4xl mx-14 top-10 relative" href="/">
          7FyD.dev
        </Link>
      </div>

      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params} />

          <div className={classes.formTitle}>
            <h3>Welcome</h3>
            <Image src="/assets/icons/hand.png" alt="hand" width={30} height={30} />
          </div>

          <p>Enter your accounts credentials, or join us!</p>

          <LoginForm />
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: "7FyD Store | Login",
  description: "Login or create an account to get started.",
  openGraph: mergeOpenGraph({
    title: "7FyD Store | Login",
    url: "/login",
  }),
};