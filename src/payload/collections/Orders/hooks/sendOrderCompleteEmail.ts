/* eslint-disable @typescript-eslint/no-unused-vars */
import payload from "payload";
import type { AfterChangeHook } from "payload/dist/collections/config/types";

import type { Order } from "../../../payload-types";

export const sendOrderCompleteEmail: AfterChangeHook<Order> = async ({ doc, req, operation }) => {
  if ((operation === "create" || operation === "update") && doc.orderDetails.status === "paid") {
    try {
      console.log("starting email");
      const productsList = doc.items
        .map(item => `1x ${typeof item.product === "string" ? item.product : item.product.title}`)
        .join("<br>");
      const orderLink = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`;
      const total = doc.total.toFixed(2);
      const username = doc.orderDetails.minecraftUsername;
      const date = new Date().toLocaleString();
      const email = doc.contactDetails.email;
      await payload.sendEmail({
        to: email,
        from: "store@exalted-kingdom.com",
        subject: "EK - Payment Successful",
        html: `
          <h1>Hello ${username},</h1>
          <h4>Thank you for your purchase! This email confirms that we have received your payment and you should receive your items soon./</h1>
          <p>This email confirms that we have received your payment and you should receive your items soon.</p>
          <p>If you do not receive your in-game items in the next 10-15 minutes, please contact a member of staff on our server. Please do not email Mojang or any of our payment processors.</p>
          <p>Purchased packages:</p>
          <p>${productsList}</p>
          <p>Information:</p>
          <p>Total: $${Number(total) / 1000} USD<br>
          <p>Order link: <a href=${orderLink}>${orderLink}</a><br>
          Username: ${username}<br>
          Date: ${date}<br>
          <p>Thank you for donating to Exalted-Kingdom. Your rank will be awarded to your minecraft account momentarily.</p>
          <p>Regards,<br>Exalted-Kingdom Team</p>
        `,
      });
    } catch (e: unknown) {
      console.error(e);
      throw e;
    }
  }
};
