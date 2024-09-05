import type { CollectionConfig } from "payload/types";

import { admins } from "../../access/admins";
import { adminsOrOrderedBy } from "./access/adminsOrOrderedBy";
import { clearUserCart } from "./hooks/clearUserCart";
import { populateOrderedBy } from "./hooks/populateOrderedBy";
import { sendDiscordMessage } from "./hooks/sendDiscordMessage";
import { updateUserPurchases } from "./hooks/updateUserPurchases";
import { LinkToPaymentIntent } from "./ui/LinkToPaymentIntent";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "createdAt",
    defaultColumns: ["createdAt", "orderedBy"],
    preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
  },
  hooks: {
    afterChange: [updateUserPurchases, clearUserCart, sendDiscordMessage],
  },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: () => true,
    delete: admins,
  },
  fields: [
    {
      name: "orderedBy",
      type: "relationship",
      relationTo: "users",
      hooks: {
        beforeChange: [populateOrderedBy],
      },
    },
    {
      name: "coupon",
      type: "relationship",
      relationTo: "coupons",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "stripePaymentIntentID",
      label: "Stripe Payment Intent ID",
      type: "text",
      admin: {
        position: "sidebar",
        components: {
          Field: LinkToPaymentIntent,
        },
      },
    },
    {
      name: "stripeCheckoutSessionID",
      label: "Stripe Checkout Session ID",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "stripeCheckoutURL",
      label: "Stripe Checkout URL",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "total",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "contactDetails",
      type: "group",
      fields: [
        {
          name: "email",
          type: "email",
          required: true,
        },
      ],
    },
    {
      name: "orderDetails",
      type: "group",
      fields: [
        {
          name: "status",
          type: "select",
          required: true,
          options: [
            { label: "Pending", value: "pending" },
            { label: "Paid", value: "paid" },
            { label: "Completed", value: "completed" },
          ],
        },
        {
          name: "minecraftUsername",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "price",
          type: "number",
          min: 0,
        },
      ],
    },
  ],
};
