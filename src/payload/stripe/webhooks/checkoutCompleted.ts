import type { StripeWebhookHandler } from "@payloadcms/plugin-stripe/dist/types";
import type { Payload } from "payload";
import type Stripe from "stripe";

import type { Product } from "../../payload-types";

const logs = false;

const getProductByStripeId = async (payload: Payload, id: string): Promise<Product | null> => {
  const product = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      stripeProductID: {
        equals: id,
      },
    },
  });
  if (logs) {
    payload.logger.info("Product: " + product.docs[0] + " ID: " + id);
  }
  /* @ts-expect-error */
  return product.docs[0];
};

export const checkoutCompleted: StripeWebhookHandler<{
  data: {
    object: Stripe.Checkout.Session;
  };
}> = async args => {
  const { event, payload, stripe } = args;

  const stripeSession = event.data.object;

  if (logs) {
    payload.logger.info(`Creating Payload Order for Stripe checkout ID: ${stripeSession.id}`);
  }

  try {
    if (logs) payload.logger.info(`- Looking up checkout session line items...`);
    const lineItems = await stripe.checkout.sessions.listLineItems(stripeSession.id);

    if (lineItems && logs) {
      payload.logger.info("Line items successfully found");
      payload.logger.info(JSON.stringify(lineItems));
    }

    const shippingAddress = stripeSession.shipping_details;
    const billingDetails = stripeSession.customer_details || stripeSession.shipping_details;

    if (!shippingAddress || !billingDetails) {
      throw new Error("Missing shipping or billing details.");
    }

    const products = await Promise.all(
      lineItems.data.map(async item => {
        if (logs) {
          payload.logger.info(item.price);
        }
        const product = await getProductByStripeId(payload, item.price.product as string);
        return {
          product: product,
          quantity: item.quantity,
          price: item.price.unit_amount,
        };
      }),
    );

    if (logs) {
      payload.logger.info("Products array created -");
      payload.logger.info(JSON.stringify(products[0]));
    }

    const orderData = {
      total: stripeSession.amount_total,
      contactDetails: {
        email: stripeSession.customer_details.email,
      },
      shippingDetails: {
        fullName: shippingAddress.name,
        country: shippingAddress.address.country,
        region: shippingAddress.address.state,
        city: shippingAddress.address.city,
        addressLineOne: shippingAddress.address.line1,
        addressLineTwo: shippingAddress.address.line2,
      },
      billingDetails: {
        fullName: billingDetails.name,
      },
      stripePaymentIntentID:
        typeof stripeSession.payment_intent === "string"
          ? stripeSession.payment_intent
          : stripeSession.payment_intent.id,
      items: products.map(item => ({
        product: typeof item.product === "string" ? item.product : item.product.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    if (logs) {
      payload.logger.info("Searching user by email... - " + stripeSession.customer_details.email);
    }
    const user = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: stripeSession.customer_details.email,
        },
      },
    });
    if (logs) {
      payload.logger.info("User found" + JSON.stringify(user));
    }

    try {
      const createdOrder = await payload.create({
        collection: "orders",
        data: orderData,
        user: user.docs[0],
      });

      if (logs) payload.logger.info(`✅ Successfully created order with ID: ${createdOrder.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      payload.logger.error(`Error creating order for session ${stripeSession.id} - ${message}`);
      console.error(error); // eslint-disable-line no-console
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    payload.logger.error(
      `General error creating order for session ${stripeSession.id} - ${message}`,
    );
    console.error(error); // eslint-disable-line no-console
  }
};
