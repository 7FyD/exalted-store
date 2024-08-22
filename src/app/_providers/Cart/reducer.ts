import type { CartItems, Product, User } from "../../../payload/payload-types";

export type CartItem = CartItems[0];

type CartType = User["cart"];

type CartAction =
  | {
      type: "SET_CART";
      payload: CartType;
    }
  | {
      type: "MERGE_CART";
      payload: CartType;
    }
  | {
      type: "ADD_ITEM";
      payload: CartItem;
    }
  | {
      type: "DELETE_ITEM";
      payload: {
        product: Product;
        size: string;
      };
    }
  | {
      type: "CLEAR_CART";
    };

export const cartReducer = (cart: CartType, action: CartAction): CartType => {
  switch (action.type) {
    case "SET_CART": {
      return action.payload;
    }
    /*     case "MERGE_CART": {
      const { payload: incomingCart } = action;

      const syncedItems: CartItem[] = [
        ...(cart?.items || []),
        ...(incomingCart?.items || []),
      ].reduce((acc: CartItem[], item) => {
        // remove duplicates
        const productId = typeof item.product === "string" ? item.product : item?.product?.id;

        const indexInAcc = acc.findIndex(({ product }) =>
          typeof product === "string" ? product === productId : product?.id === productId,
        ); // eslint-disable-line function-paren-newline

        if (indexInAcc > -1) {
          acc[indexInAcc] = {
            ...acc[indexInAcc],
            // customize the merge logic here, e.g.:
            // quantity: acc[indexInAcc].quantity + item.quantity
          };
        } else {
          acc.push(item);
        }
        return acc;
      }, []);

      return {
        ...cart,
        items: syncedItems,
      };
    }*/
    // case "MERGE_CART": {
    //   const { payload: incomingCart } = action;

    //   const itemMap = new Map<string, CartItem>();

    //   const allItems = [...(cart?.items || []), ...(incomingCart?.items || [])];

    //   allItems.forEach(item => {
    //     const productId = typeof item.product === "string" ? item.product : item?.product?.id;
    //     const itemSize = item.size;
    //     const itemKey = `${productId}_${itemSize}`;

    //     console.log(`Processing item: ${itemKey}`);

    //     if (itemMap.has(itemKey)) {
    //       const existingItem = itemMap.get(itemKey);
    //       console.log(`Existing item found for key ${itemKey}:`, existingItem);

    //       if (existingItem) {
    //         itemMap.set(itemKey, {
    //           ...existingItem,
    //           quantity: (existingItem.quantity || 0) + (item.quantity || 0),
    //         });
    //         console.log(`Updated item for key ${itemKey}:`, itemMap.get(itemKey));
    //       }
    //     } else {
    //       itemMap.set(itemKey, item);
    //       console.log(`New item added for key ${itemKey}:`, item);
    //     }
    //   });

    //   const syncedItems = Array.from(itemMap.values());

    //   console.log("Cart after:", { ...cart, items: syncedItems });

    //   return {
    //     ...cart,
    //     items: syncedItems,
    //   };
    // }

    case "MERGE_CART": {
      const { payload: incomingCart } = action;

      const syncedItems: CartItem[] = [
        ...(cart?.items || []),
        ...(incomingCart?.items || []),
      ].reduce((acc: CartItem[], item) => {
        // Extract productId and size from item
        const productId = typeof item.product === "string" ? item.product : item?.product?.id;
        const { size } = item;

        // Find index in acc based on productId and size
        const indexInAcc = acc.findIndex(
          ({ product, size: accSize }) =>
            (typeof product === "string" ? product === productId : product?.id === productId) &&
            accSize === size,
        );

        if (indexInAcc > -1) {
          // Customize the merge logic here if necessary
          acc[indexInAcc] = {
            ...acc[indexInAcc],
            quantity: Math.max(acc[indexInAcc].quantity || 0, item.quantity || 0), // Example: summing the quantities
            // Add other properties to merge if needed
          };
        } else {
          acc.push(item);
        }
        return acc;
      }, []);

      return {
        ...cart,
        items: syncedItems,
      };
    }

    case "ADD_ITEM": {
      const { payload: incomingItem } = action;
      const productId =
        typeof incomingItem.product === "string" ? incomingItem.product : incomingItem?.product?.id;

      const indexInCart = cart?.items?.findIndex(
        ({ product, size }) =>
          (typeof product === "string" ? product === productId : product?.id === productId) &&
          size === incomingItem.size,
      );

      let withAddedItem = [...(cart?.items || [])];

      if (indexInCart === -1) {
        withAddedItem.push(incomingItem);
      } else if (typeof indexInCart === "number" && indexInCart > -1) {
        withAddedItem[indexInCart] = {
          ...withAddedItem[indexInCart],
          quantity:
            (incomingItem.quantity || 0) > 0
              ? incomingItem.quantity
              : withAddedItem[indexInCart].quantity,
        };
      }

      return {
        ...cart,
        items: withAddedItem,
      };
    }

    case "DELETE_ITEM": {
      const {
        payload: { product, size },
      } = action;
      const withDeletedItem = { ...cart };

      const indexInCart = cart?.items?.findIndex(({ product: cartProduct, size: cartSize }) =>
        typeof cartProduct === "string"
          ? cartProduct === product.id && cartSize === size
          : cartProduct?.id === product.id && cartSize === size,
      ); // eslint-disable-line

      if (typeof indexInCart === "number" && withDeletedItem.items && indexInCart > -1) {
        withDeletedItem.items.splice(indexInCart, 1);
      }

      return withDeletedItem;
    }

    case "CLEAR_CART": {
      return {
        ...cart,
        items: [],
      };
    }

    default: {
      return cart;
    }
  }
};
