export const countPricesFromJSON = (jsonString: string): number => {
  const uniquePrices = new Set<number>();

  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString)?.data;
      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          uniquePrices.add(item.unit_amount);
        });
      }
    } catch (e: unknown) {
      console.error(`Cannot parse JSON: ${e}`); // eslint-disable-line no-console
    }
  }

  return uniquePrices.size;
};

export const priceFromJSON = (
  jsonString: string,
  size: string,
  quantity = 1,
  raw?: boolean,
): string => {
  let price = "";
  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString)?.data;
      if (Array.isArray(parsed)) {
        const priceObject = size
          ? parsed.find((item: any) => item.metadata?.size === size)
          : parsed[0];
        if (priceObject) {
          const priceValue = priceObject.unit_amount * quantity;
          const priceType = priceObject.type;

          if (raw) return priceValue.toString();

          price = (priceValue / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "EUR", // TODO: use `priceObject.currency`
          });

          if (priceType === "recurring") {
            price += `/${
              priceObject.recurring.interval_count > 1
                ? `${priceObject.recurring.interval_count} ${priceObject.recurring.interval}`
                : priceObject.recurring.interval
            }`;
          }
        }
      }
    } catch (e: unknown) {
      console.error(`Cannot parse priceJSON`); // eslint-disable-line no-console
    }
  }

  return price;
};

export const priceIdFromJSON = (jsonString: string, size: string): string | null => {
  let id: string | null = null;
  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString)?.data;
      if (Array.isArray(parsed)) {
        const priceObject = parsed.find((item: any) => item.metadata?.size === size);
        if (priceObject && priceObject.id) {
          id = priceObject.id;
        }
      }
    } catch (e: unknown) {
      console.error("Cannot parse JSON"); // eslint-disable-line no-console
    }
  }
  return id;
};

export const unitAmountFromJSON = (jsonData: string): number | null => {
  // Parse the JSON string to JavaScript object
  const data = JSON.parse(jsonData);

  // Check if the object contains data array and it's not empty
  if (data && Array.isArray(data.data) && data.data.length > 0) {
    // Extract the unit_amount from the first item in the data array
    const unitAmount = data.data[0].unit_amount;

    // Return the unit_amount
    return unitAmount;
  } else {
    // Return null if the data is empty or doesn't match the expected format
    return null;
  }
};
