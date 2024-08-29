import type { StripeWebhookHandler } from "@payloadcms/plugin-stripe/dist/types";
import type Stripe from "stripe";

const logs = false;

export const checkoutCompleted: StripeWebhookHandler<{
  data: {
    object: Stripe.Checkout.Session;
  };
}> = async args => {
  const { event, payload } = args;
  const stripeSession = event.data.object;
  if (logs) {
    payload.logger.info(stripeSession);
  }
  if (stripeSession.payment_status === "paid") {
    try {
      const stripePaymentIntentID =
        typeof stripeSession.payment_intent === "string"
          ? stripeSession.payment_intent
          : stripeSession.payment_intent.id;

      const order = await payload.update({
        collection: "orders",
        where: {
          stripeCheckoutSessionID: {
            equals: stripeSession.id, // unique field
          },
        },
        data: {
          orderDetails: {
            status: "paid" as "pending" | "paid" | "completed",
          },
          stripePaymentIntentID,
        },
      });
      if (logs) {
        payload.logger.info(`✅ Successfully updated order with ID: ${order.docs[0].id}`);
      }
    } catch (error: unknown) {
      console.error("Error processing Stripe webhook:", error);
    }
  }
};
