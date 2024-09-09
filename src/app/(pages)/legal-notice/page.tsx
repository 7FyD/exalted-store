import Link from "next/link";

import { Gutter } from "../../_components/Gutter";

const LegalNotice = () => {
  return (
    <Gutter>
      <h2 className="text-2xl font-medium">Legal notice</h2>
      <p className="my-4">
        The Exalted-Kingdom server is in no way affiliated with Mojang Studios, Minecraft or
        Microsoft, nor should it be considered a company endorsed by Mojang Studios, Minecraft or
        Microsoft. Any contributions or purchases made on this store goes to the Exalted-Kingdom
        team.
      </p>
      <p>
        To complete a transaction, the following steps must be followed: Choose the rank that you
        want to buy and write your in game name and apply promotional/referral codes if you have
        any. Afterwards, enter a safe & secure checkout page handled by Stripe. After you have
        completed the payment, you will receive your rank within 12 hours of the purchase. We remind
        you that all the transactions are secure and handled by Stripe or PayPal, and the processing
        time it takes to complete it is not dependent on us.
      </p>
      <p className="my-4">
        In most cases, the payment process is instant and you will receive your rank immediately,
        however if there are any issues, please contact us via Discord or email us at
        exalted-kingdom@proton.me. In order to join our Discord server, please click{" "}
        <Link
          className="text-blue-400 hover:underline hover:text-blue-600"
          href="https://exalted-kingdom.com/discord"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </Link>
        .{" "}
      </p>
      <p>For any further information please open a ticket on our Discord server.</p>
    </Gutter>
  );
};

export default LegalNotice;
