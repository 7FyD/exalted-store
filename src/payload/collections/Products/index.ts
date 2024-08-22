import type { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import type { CollectionConfig } from "payload/types";

import { admins } from "../../access/admins";
import { Archive } from "../../blocks/ArchiveBlock";
import { CallToAction } from "../../blocks/CallToAction";
import { Content } from "../../blocks/Content";
import { MediaBlock } from "../../blocks/MediaBlock";
import { slugField } from "../../fields/slug";
import { populateArchiveBlock } from "../../hooks/populateArchiveBlock";
import { checkUserPurchases } from "./access/checkUserPurchases";
import { beforeProductChange } from "./hooks/beforeChange";
import { deleteProductFromCarts } from "./hooks/deleteProductFromCarts";
import { revalidateProduct } from "./hooks/revalidateProduct";
import { ProductSelect } from "./ui/ProductSelect";

const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "stripeProductID", "_status"],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`;
    },
  },
  hooks: {
    beforeChange: [beforeProductChange],
    afterChange: [revalidateProduct],
    afterRead: [populateArchiveBlock],
    afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "sizes",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "size",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "additionalInformation", // required
      type: "array", // required
      label: "Additional information",
      minRows: 1,
      maxRows: 4,
      interfaceName: "AdditionalInformation",
      labels: {
        singular: "Information entry",
        plural: "Information entries",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "message",
          type: "text",
          required: true,
        },
      ],
      admin: {
        components: {
          RowLabel: ({ data, index }: RowLabelArgs) => {
            return data?.title || `Entry ${String(index).padStart(2, "0")}`;
          },
        },
      },
    },
    {
      name: "publishedOn",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "layout",
              type: "blocks",
              required: true,
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
        {
          label: "Product Details",
          fields: [
            {
              name: "stripeProductID",
              label: "Stripe Product",
              type: "text",
              admin: {
                components: {
                  Field: ProductSelect,
                },
              },
            },
            {
              name: "priceJSON",
              label: "Price JSON",
              type: "textarea",
              admin: {
                readOnly: true,
                hidden: true,
                rows: 10,
              },
            },
            {
              name: "enablePaywall",
              label: "Enable Paywall",
              type: "checkbox",
            },
            {
              name: "paywall",
              label: "Paywall",
              type: "blocks",
              access: {
                read: checkUserPurchases,
              },
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
      ],
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "relatedProducts",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        };
      },
    },
    slugField(),
    {
      name: "skipSync",
      label: "Skip Sync",
      type: "checkbox",
      admin: {
        position: "sidebar",
        readOnly: true,
        hidden: true,
      },
    },
  ],
};

export default Products;