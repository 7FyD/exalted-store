"use server";

import { headers } from "next/headers";
import type { Stripe } from "stripe";

import { stripe } from "../../app/_lib/stripe";
import type { CartItem } from "../../app/_providers/Cart/reducer";
import { priceIdFromJSON } from "../../app/_utilities/priceUtilities";

export async function createCheckoutSession(
  cartItems: CartItem[],
  userEmail: string,
  couponId?: string | null,
): Promise<{ url: string | null; stripeCheckoutSessionID: string | null }> {
  // TODO?: check mojang api if error return server-side error to combat frontend manipuation
  const origin: string = headers().get("origin") as string;
  const line_items = cartItems.map(item => ({
    price:
      typeof item.product !== "string" ? priceIdFromJSON(item.product.priceJSON) : item.product,
    quantity: 1,
  }));
  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
    discounts: [
      {
        coupon: couponId,
      },
    ],
    shipping_address_collection: {
      allowed_countries: [
        "US", // USA
        "CA", // Canada
        // European countries
        "AT", // Austria
        "BE", // Belgium
        "BG", // Bulgaria
        "HR", // Croatia
        "CY", // Cyprus
        "CZ", // Czech Republic
        "DK", // Denmark
        "EE", // Estonia
        "FI", // Finland
        "FR", // France
        "DE", // Germany
        "GR", // Greece
        "HU", // Hungary
        "IE", // Ireland
        "IT", // Italy
        "LV", // Latvia
        "LT", // Lithuania
        "LU", // Luxembourg
        "MT", // Malta
        "NL", // Netherlands
        "PL", // Poland
        "PT", // Portugal
        "RO", // Romania
        "SK", // Slovakia
        "SI", // Slovenia
        "ES", // Spain
        "SE", // Sweden
        "GB", // United Kingdom
      ],
    },
    customer_email: userEmail,
  });
  return {
    url: session.url,
    stripeCheckoutSessionID: session.id,
  };
}
