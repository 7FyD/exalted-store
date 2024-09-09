import { FaDiscord } from "react-icons/fa";
import { Mail, MapPin } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { Gutter } from "../../_components/Gutter";
import { mergeOpenGraph } from "../../_utilities/mergeOpenGraph";

const Contact = async () => {
  return (
    <div>
      <Gutter className="space-y-3">
        <h4 className="text-lg font-light">How can we help you?</h4>
        <h1 className="text-2xl font-semibold">Contact us</h1>
        <p className="max-w-md">
          We're here to help you throughout any issues that you are facing. We look forward to
          hearing from you!
        </p>
        <div className="flex flex-col items-start justify-center gap-2 !mt-6">
          <div className="flex flex-row items-center gap-3">
            <Mail />
            <Link
              className="text-blue-400 hover:underline hover:text-blue-600"
              href="mailto:exalted-kingdom@proton.me"
            >
              exalted-kingdom@proton.me
            </Link>
          </div>
          <div className="flex flex-row items-center gap-3">
            <FaDiscord size={24} />
            <Link
              className="text-blue-400 hover:underline hover:text-blue-600"
              href="https://exalted-kingdom.com/discord"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click to join our discord!
            </Link>
          </div>
        </div>
      </Gutter>
    </div>
  );
};

export default Contact;

export const metadata: Metadata = {
  title: "Exalted Kingdom Store - Contact",
  description: "Contact us - get in touch now!",
  openGraph: mergeOpenGraph({
    title: "Exalted Kingdom Store - Contact",
    url: "/login",
  }),
};
