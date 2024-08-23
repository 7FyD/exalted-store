import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, MEDIA_BLOCK } from "./blocks";
import { PRODUCT_CATEGORIES } from "./categories";
import { META } from "./meta";
export const PRODUCTS = `
  query Products($limit: Int, $sort: String) {
    Products(limit: $limit, sort: $sort) {
      docs {
        title
        slug
        additionalInformation {
          title
          message
        }
        meta { 
          title
          image {
            url
            width
            height
          }
        }
        priceJSON
        stripeProductID

        
      }
    }
  }
`;

export const PRODUCT = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        id
        title
        additionalInformation {
          title
          message
        }
        stripeProductID
        ${PRODUCT_CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        priceJSON
        enablePaywall
        relatedProducts {
          id
          slug
          title
          ${META}
        }
        ${META}
      }
    }
  }
`;

export const PRODUCT_PAYWALL = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        paywall {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
      }
    }
  }
`;
