"use server";

import payload from "payload";

import type { Coupon } from "../../../../payload/payload-types";

export async function checkCoupon(
  enteredCoupon: string,
): Promise<{ success: string; foundCoupon: Coupon } | { error: string }> {
  const coupons = await payload.find({
    collection: "coupons",
  });
  if (coupons.docs.length === 0) {
    return { error: "Coupon is invalid" };
  }

  const coupon = coupons.docs.find(item => item.name === enteredCoupon);
  if (coupon) {
    return { success: "Coupon is valid", foundCoupon: coupon as unknown as Coupon };
  }
  return { error: "Coupon is invalid" };
}
