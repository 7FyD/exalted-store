export const PRODUCT_CATEGORIES = `categories {
  title
  id
  breadcrumbs {
    id
    label
  }
}`;

export const CATEGORIES = `
  query Categories($limit: Int, $sort: String) {
    Categories(limit: $limit, sort: $sort) {
      docs {
        id
        title
        media {
          alt
          width
          height
          url
        }
      }
    }
  }
`;
