"use server";

import { stripe } from "../_lib/stripe";

const getStripeCheckout = async (
  session_id: string,
): Promise<{ error?: string; name?: string }> => {
  if (!session_id) {
    return { error: "Invalid order." };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return { name: session.customer_details.name };
  } catch (error: unknown) {
    return { error: "Unable to retrieve order data." };
  }
};

export default getStripeCheckout;
