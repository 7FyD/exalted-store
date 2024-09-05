import type { CollectionConfig } from "payload/types";

import { admins } from "../../access/admins";

const Coupons: CollectionConfig = {
  slug: "coupons",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "id", "uses"],
  },
  access: {
    read: admins,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "id",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "uses",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "discount",
      label: "Discount (%)",
      type: "number",
      required: true,
      defaultValue: 0,
    },
  ],
};

export default Coupons;
