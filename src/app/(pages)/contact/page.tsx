import { Mail, MapPin, Phone } from "lucide-react";

import { Gutter } from "../../_components/Gutter";

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
            <p>contact@7fyd.dev</p>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Phone />
            <p>+40 770 123 123</p>
          </div>
          <div className="flex flex-row items-center gap-3">
            <MapPin />
            <p>4 Privet Drive, Little Whinging, Surrey, England, Great Britain</p>
          </div>
        </div>
      </Gutter>
    </div>
  );
};

export default Contact;
