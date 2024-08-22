import { Metadata } from "next";

import { Button } from "../_components/Button";
import { Gutter } from "../_components/Gutter";
import { VerticalPadding } from "../_components/VerticalPadding";
import { mergeOpenGraph } from "../_utilities/mergeOpenGraph";

export default function NotFound() {
  return (
    <Gutter>
      <VerticalPadding top="none" bottom="large">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p>This page could not be found.</p>
        <Button href="/" label="Go Home" appearance="primary" />
      </VerticalPadding>
    </Gutter>
  );
}

export const metadata: Metadata = {
  title: "404 | Page not found",
  description: "Styleguide",
  openGraph: mergeOpenGraph({
    title: "404 | Page not found",
    url: "/not-found",
  }),
};
