"use server";

import payload from "payload";

import type { Product, User } from "../../../../payload/payload-types";
import type { CartItem } from "../../../_providers/Cart/reducer";
import { priceNumberFromJSON } from "../../../_utilities/priceUtilities";

const logs = true;

export const createOrder = async (
  cartItems: CartItem[],
  userEmail: string,
  username: string,
): Promise<string> => {
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
          quantity: item.quantity,
          price: product.priceJSON,
        };
      }),
    );

    // calculate cart total
    const total = products.reduce(
      (sum, item) => sum + priceNumberFromJSON(item.price, item.quantity),
      0,
    );
    payload.logger.info(`Total: ${total}`);
    // build the order data
    const orderData = {
      total,
      orderedBy: user.id,
      contactDetails: {
        email: user.email,
      },
      orderDetails: {
        status: "pending" as "pending" | "paid" | "completed",
        minecraftUsername: username,
      },
      items: products,
    };
    // create the order
    try {
      const createdOrder = await payload.create({
        collection: "orders",
        data: {
          ...orderData,
          items: orderData.items.map(item => ({
            product: item.product.id,
            quantity: item.quantity,
            price: priceNumberFromJSON(item.price, 1),
          })),
        },
      });

      if (logs) payload.logger.info(`✅ Successfully created order with ID: ${createdOrder.id}`);
      // TODO: add success/error frontend handling
      return "success";
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      payload.logger.error(`Error creating order for user ${userEmail} - ${message}`);
      throw error;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    payload.logger.error(`General error creating order for user ${userEmail} - ${message}`);
    throw error;
  }
};
