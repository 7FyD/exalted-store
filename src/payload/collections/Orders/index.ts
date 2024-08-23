import type { CollectionConfig } from "payload/types";

import { admins } from "../../access/admins";
import { adminsOrOrderedBy } from "./access/adminsOrOrderedBy";
import { clearUserCart } from "./hooks/clearUserCart";
import { populateOrderedBy } from "./hooks/populateOrderedBy";
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
    afterChange: [updateUserPurchases, clearUserCart],
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
        {
          name: "phoneNumber",
          type: "text",
          required: false,
        },
      ],
    },
    {
      name: "shippingDetails",
      type: "group",
      fields: [
        {
          name: "fullName",
          type: "text",
          required: true,
        },
        {
          name: "company",
          type: "text",
          required: false,
        },
        {
          name: "country",
          type: "text",
          required: true,
        },
        {
          name: "region",
          type: "text",
          required: true,
        },
        {
          name: "city",
          type: "text",
          required: true,
        },
        {
          name: "addressLineOne",
          type: "text",
          required: true,
        },
        {
          name: "addressLineTwo",
          type: "text",
          required: false,
        },
      ],
    },
    {
      name: "billingDetails",
      type: "group",
      fields: [
        {
          name: "fullName",
          type: "text",
          required: false,
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
        {
          name: "quantity",
          type: "number",
          min: 0,
        },
      ],
    },
  ],
};
