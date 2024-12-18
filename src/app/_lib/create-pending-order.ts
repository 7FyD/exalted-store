"use server";

import payload from "payload";

import type { Coupon, Product, User } from "../../payload/payload-types";
import type { CartItem } from "../_providers/Cart/reducer";
import { priceNumberFromJSON } from "../_utilities/priceUtilities";

const logs = true;

export const createOrder = async (
  cartItems: CartItem[],
  userEmail: string,
  username: string,
  stripeCheckoutSessionID: string,
  stripeCheckoutURL: string,
  coupon: Coupon | null,
): Promise<{ success: boolean }> => {
  if (cartItems.length < 1 || !userEmail || !username) {
    throw new Error("Invalid order data.");
  }
  if (logs) {
    payload.logger.info(`Creating Payload Order for user: ${userEmail}`);
  }

  try {
    const userQuery = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: userEmail,
        },
      },
    });

    const user = userQuery.docs[0] as unknown as User;

    if (!user) {
      throw new Error(`User not found with email: ${userEmail}`);
    }

    // fetch all products from the cart items
    const products = await Promise.all(
      cartItems.map(async item => {
        const product = (await payload.findByID({
          collection: "products",
          id: typeof item.product === "string" ? item.product : item.product.id,
        })) as unknown as Product;

        return {
          product,
          price: product.priceJSON,
        };
      }),
    );

    // calculate cart total
    const total = products.reduce((sum, item) => sum + priceNumberFromJSON(item.price), 0);
    payload.logger.info(`Total: ${total}`);
    // build the order data
    const orderData = {
      total,
      stripeCheckoutSessionID,
      stripeCheckoutURL,
      orderedBy: user.id,
      contactDetails: {
        email: user.email,
      },
      orderDetails: {
        status: "pending" as "pending" | "paid" | "completed",
        minecraftUsername: username,
      },
      items: products,
      coupon: coupon?.id,
    };
    // create the order
    try {
      const createdOrder = await payload.create({
        collection: "orders",
        data: {
          ...orderData,
          items: orderData.items.map(item => ({
            product: item.product.id,
            price: priceNumberFromJSON(item.price),
          })),
        },
      });

      if (logs) payload.logger.info(`✅ Successfully created order with ID: ${createdOrder.id}`);
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      payload.logger.error(`Error creating order for user ${userEmail} - ${message}`);
      return { success: false };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    payload.logger.error(`General error creating order for user ${userEmail} - ${message}`);
    return { success: false };
  }
};
