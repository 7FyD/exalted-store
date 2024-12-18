/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AfterChangeHook } from "payload/dist/collections/config/types";

import type { Order } from "../../../payload-types";
export const sendDiscordMessage: AfterChangeHook<Order> = async ({ doc, req, operation }) => {
  if (
    (operation === "update" || operation == "create") &&
    doc.orderedBy &&
    doc.orderDetails.status === "paid"
  ) {
    const { payload } = req;
    const coupon = doc.coupon || null;
    if (coupon) {
      const couponID = typeof coupon === "string" ? coupon : coupon.id;
      const updatedCoupon = await payload.update({
        collection: "coupons",
        id: couponID,
        data: {
          uses: typeof coupon === "string" ? 0 : coupon.uses + 1,
        },
      });
    }
    const minecraftUsername = doc.orderDetails.minecraftUsername;
    const items = doc.items
      .map(item => (typeof item.product === "string" ? item.product : item.product.title))
      .join(", ");
    try {
      const apiKey = process.env.DISCORD_WEBHOOK_SECRET;
      const message = `New order from user "${minecraftUsername}" for: "${items}"! <@248814919170916353> <@1229018477293998125>.`;
      const channelId = process.env.DISCORD_WEBHOOK_CHANNEL_ID;
      const timestamp = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      console.log("discord request timestamp: " + timestamp);
      const response = await fetch("http://65.108.249.37:3001/v1/order/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          message,
          channelId,
          timestamp,
        }),
      });
      if (!response.ok) {
        console.error("Failed to send Discord message:", await response.text());
      }
    } catch (error: unknown) {
      console.error("Error sending Discord message:", error);
    }
  }
  return;
};
