export const priceFromJSON = (jsonString: string, quantity = 1, raw?: boolean): string => {
  let price = "";
  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString)?.data[0];
      const priceValue = parsed.unit_amount * quantity;
      const priceType = parsed.type;

      if (raw) return priceValue.toString();

      price = (priceValue / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "EUR", // TODO: use `parsed.currency`
      });

      if (priceType === "recurring") {
        price += `/${
          parsed.recurring.interval_count > 1
            ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
            : parsed.recurring.interval
        }`;
      }
    } catch (e: unknown) {
      console.error(`Cannot parse priceJSON`); // eslint-disable-line no-console
    }
  }

  return price;
};

export const priceIdFromJSON = (jsonString: string): string | null => {
  let id: string | null = null;
  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString)?.data[0];
      if (parsed?.id) {
        id = parsed.id;
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

export const priceNumberFromJSON = (priceJSON: string, quantity: number): number => {
  let total = 0;
  if (priceJSON) {
    try {
      const parsed = JSON.parse(priceJSON)?.data[0];
      if (parsed?.unit_amount) {
        total = parsed.unit_amount * quantity;
      }
    } catch (e: unknown) {
      console.error("Cannot parse priceJSON"); // eslint-disable-line no-console
    }
  }
  return total;
};
