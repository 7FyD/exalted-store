import { Metadata } from "next";

import { mergeOpenGraph } from "../../_utilities/mergeOpenGraph";
import SuccessPage from "./SuccessPage";

const Success = ({ searchParams }) => {
  return <SuccessPage searchParams={searchParams} />;
};

export default Success;

export const metadata: Metadata = {
  title: "7FyD Store | Styleguide",
  description: "Styleguide",
  openGraph: mergeOpenGraph({
    title: "7FyD Store | Styleguide",
    url: "/styleguide",
  }),
};
