import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Page, Settings } from "../../../payload/payload-types";
import { fetchDoc } from "../../_api/fetchDoc";
import { fetchSettings } from "../../_api/fetchGlobals";
import { Blocks } from "../../_components/Blocks";
import { Gutter } from "../../_components/Gutter";
import { generateMeta } from "../../_utilities/generateMeta";
import { Account } from "./AccountModal";
import { CartPage } from "./CartPage";

import classes from "./index.module.scss";

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../[slug]/page.tsx' about this
export const dynamic = "force-dynamic";

export default async function Cart() {
  const account_cookie = cookies().get("minecraft_account");
  let account: Account | null = null;

  if (account_cookie && account_cookie.value) {
    try {
      account = JSON.parse(account_cookie.value);
    } catch (error) {
      console.error("Error parsing account cookie:", error);
    }
  }

  let page: Page | null = null;

  try {
    page = await fetchDoc<Page>({
      collection: "pages",
      slug: "cart",
    });
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  if (!page) {
    return notFound();
  }

  let settings: Settings | null = null;

  try {
    settings = await fetchSettings();
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  return (
    <div className={classes.container}>
      <Gutter>
        <CartPage settings={settings} page={page} account={account} />
      </Gutter>
      <Blocks blocks={page?.layout} disableBottomPadding />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  let page: Page | null = null;

  try {
    page = await fetchDoc<Page>({
      collection: "pages",
      slug: "cart",
    });
  } catch (error) {
    // don't throw an error if the fetch fails
    // this is so that we can render a static cart page for the demo
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // in production you may want to redirect to a 404  page or at least log the error somewhere
  }

  return generateMeta({ doc: page });
}
