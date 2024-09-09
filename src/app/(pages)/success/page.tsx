import { Metadata } from "next";

import { mergeOpenGraph } from "../../_utilities/mergeOpenGraph";
import SuccessPage from "./SuccessPage";

const Success = ({ searchParams }) => {
  return <SuccessPage searchParams={searchParams} />;
};

export default Success;

export const metadata: Metadata = {
  title: "Exalted Kingdom Store - Order successful",
  description: "Styleguide",
  openGraph: mergeOpenGraph({
    title: "Exalted Kingdom Store - Order successful",
    url: "/success",
  }),
};
