import React from "react";
import { Metadata } from "next";
import Link from "next/link";

import { getMe } from "../../_api/getMe";
import { Gutter } from "../../_components/Gutter";
import { VerticalPadding } from "../../_components/VerticalPadding";
import { getMeUser } from "../../_utilities/getMeUser";
import { mergeOpenGraph } from "../../_utilities/mergeOpenGraph";

export default async function Typography() {
  const user = await getMeUser();
  if (!user.user.roles.find(element => element === "admin"))
    return <h3 className="text-center text-lg text-red-500">Error! Invalid request.</h3>;
  return (
    <Gutter>
      <VerticalPadding bottom="large" top="none">
        <h1>Styleguide</h1>
        <Link href="/styleguide/typography">Typography</Link>
        <br />
        <h2>Blocks</h2>
        <Link href="/styleguide/content-block">Content Block</Link>
        <br />
        <Link href="/styleguide/media-block">Media Block</Link>
        <br />
        <Link href="/styleguide/call-to-action">Call To Action Block</Link>
        <br />
        <h2>Components</h2>
        <Link href="/styleguide/buttons">Buttons</Link>
        <br />
        <Link href="/styleguide/message">Message</Link>
      </VerticalPadding>
    </Gutter>
  );
}

export const metadata: Metadata = {
  title: "7FyD Store | Styleguide",
  description: "Styleguide",
  openGraph: mergeOpenGraph({
    title: "7FyD Store | Styleguide",
    url: "/styleguide",
  }),
};
