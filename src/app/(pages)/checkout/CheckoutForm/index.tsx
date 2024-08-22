"use client";

import React, { Fragment, useCallback, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import validator from "validator";
import * as z from "zod";

import { Order } from "../../../../payload/payload-types";
import { Button } from "../../../_components/Button";
import { Message } from "../../../_components/Message";
import { Button as ButtonCN } from "../../../_components/ui/button";
import { Checkbox } from "../../../_components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../_components/ui/form";
import { Input } from "../../../_components/ui/input";
import { useCart } from "../../../_providers/Cart";
import { priceFromJSON } from "../../../_utilities/priceUtilities";

import classes from "./index.module.scss";

const detailsSchema = z.object({
  email: z.string().email().min(2, "Email is required"),
  phone: z
    .optional(z.string().refine(validator.isMobilePhone, "Please enter a valid phone number"))
    .or(z.literal("")),
  firstName: z.string().min(2, "Please enter a valid first name"),
  lastName: z.string().min(2, "Please enter a valid last name"),
  company: z.optional(z.string().min(2, "Please enter a valid company name")).or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "County is required"),
  city: z.string().min(1, "City is required"),
  lineOne: z.string().min(3, "Please enter a valid address"),
  lineTwo: z.string().min(3, "Please enter a valid address"),
  billingFirstName: z
    .optional(z.string().min(2, "Please enter a valid first name"))
    .or(z.literal("")),
  billingLastName: z
    .optional(z.string().min(2, "Please enter a valid last name"))
    .or(z.literal("")),
});

export const CheckoutForm: React.FC<{}> = () => {
  // payment
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { cart, cartTotal } = useCart();
  const [shippingAddress, setShippingAddress] = useState<z.infer<typeof detailsSchema> | null>(
    null,
  );
  const handlePaymentSubmit = useCallback(
    async e => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const { error: stripeError, paymentIntent } = await stripe?.confirmPayment({
          elements: elements!,
          redirect: "if_required",
          confirmParams: {
            return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-confirmation`,
          },
        });

        if (stripeError) {
          setError(stripeError.message);
          setIsLoading(false);
        }

        if (paymentIntent) {
          try {
            const orderReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                total: cartTotal.raw,
                contactDetails: {
                  email: shippingAddress.email,
                  phoneNumber: shippingAddress.phone,
                },
                shippingDetails: {
                  fullName: shippingAddress.firstName + " " + shippingAddress.lastName,
                  company: shippingAddress.company,
                  country: shippingAddress.country,
                  region: shippingAddress.region,
                  city: shippingAddress.city,
                  addressLineOne: shippingAddress.lineOne,
                  addressLineTwo: shippingAddress.lineTwo,
                },
                billingDetails: {
                  fullName:
                    shippingAddress.billingFirstName + " " + shippingAddress.billingLastName,
                },
                stripePaymentIntentID: paymentIntent.id,
                items: (cart?.items || [])?.map(({ product, quantity, size }) => ({
                  product: typeof product === "string" ? product : product.id,
                  size,
                  quantity,
                  price:
                    typeof product === "object"
                      ? priceFromJSON(product.priceJSON, size, 1, true)
                      : undefined,
                })),
              }),
            });

            if (!orderReq.ok) throw new Error(orderReq.statusText || "Something went wrong.");

            const {
              error: errorFromRes,
              doc,
            }: {
              message?: string;
              error?: string;
              doc: Order;
            } = await orderReq.json();

            if (errorFromRes) throw new Error(errorFromRes);

            router.push(`/order-confirmation?order_id=${doc.id}`);
          } catch (err) {
            // don't throw an error if the order was not created successfully
            // this is because payment _did_ in fact go through, and we don't want the user to pay twice
            console.error(err.message); // eslint-disable-line no-console
            router.push(`/order-confirmation?error=${encodeURIComponent(err.message)}`);
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setError(`Error while submitting payment: ${msg}`);
        setIsLoading(false);
      }
    },
    [stripe, elements, router, cart, cartTotal, shippingAddress],
  );
  // end payment

  // shipment
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [showBilling, setShowBilling] = useState<boolean>(false);
  const handleDeliverySubmit = (values: z.infer<typeof detailsSchema>) => {
    setError("");
    const safeValues = detailsSchema.safeParse(values);
    if (!safeValues.success) {
      setError("Invalid data input.");
    } else if (showBilling && (!values.billingFirstName || !values.billingLastName)) {
      setError("Invalid data input. All billing data must be valid.");
    } else {
      if (!showBilling) {
        values.billingFirstName = values.firstName;
        values.billingLastName = values.lastName;
      }
      setShippingAddress(values);
      setShowPayment(true);
    }
  };
  const deliveryForm = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      company: "",
      country: "",
      region: "",
      city: "",
      lineOne: "",
      lineTwo: "",
      billingFirstName: "",
      billingLastName: "",
    },
  });
  // end shipment
  return (
    <div className="bg-[#f3f3f3] p-6 rounded-md">
      {(!shippingAddress || !showPayment) && (
        <Fragment>
          {error && <Message error={error} />}
          <Form {...deliveryForm}>
            <form
              className="flex flex-col"
              onSubmit={deliveryForm.handleSubmit(handleDeliverySubmit)}
            >
              <h1 className="font-semibold text-xl my-2">Contact details</h1>
              <FormField
                control={deliveryForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="bg-white" {...field} placeholder="your-name@proton.me" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deliveryForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number - Optional</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="number"
                        {...field}
                        placeholder="+40 770 123 123"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h1 className="font-semibold text-xl my-2">Shipping details</h1>
              <div className="flex flex-col md:flex-row w-full gap-0 md:gap-12">
                <FormField
                  control={deliveryForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} placeholder="John" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={deliveryForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} placeholder="Smith" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={deliveryForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company - Optional</FormLabel>
                    <FormControl>
                      <Input className="bg-white" {...field} placeholder="Infinite Money S.R.L." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deliveryForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <CountryDropdown
                        classes="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {deliveryForm.watch("country") && (
                <FormField
                  control={deliveryForm.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <RegionDropdown
                          classes="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          country={deliveryForm.watch("country")}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {deliveryForm.watch("region") && (
                <FormField
                  control={deliveryForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} placeholder="Enter city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}{" "}
              {deliveryForm.watch("city") && (
                <FormField
                  control={deliveryForm.control}
                  name="lineOne"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address line one</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} placeholder="Street, block number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}{" "}
              {deliveryForm.watch("city") && (
                <FormField
                  control={deliveryForm.control}
                  name="lineTwo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address line two</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          {...field}
                          placeholder="Apartment number, level"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {showBilling && (
                <div className="mt-8">
                  <h1 className="font-semibold text-xl mb-2">Billing details</h1>
                  <div className="flex flex-col md:flex-row w-full gap-0 md:gap-12">
                    <FormField
                      control={deliveryForm.control}
                      name="billingFirstName"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-1/2">
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input className="bg-white" {...field} placeholder="Johnnas" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={deliveryForm.control}
                      name="billingLastName"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-1/2">
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input className="bg-white" {...field} placeholder="Smithens" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-row mt-16 gap-3 items-center">
                <Checkbox
                  id="terms"
                  defaultChecked={true}
                  onCheckedChange={() => setShowBilling(!showBilling)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Billing address same as shipping address
                </label>
              </div>
              <ButtonCN className="w-auto md:w-1/4 mt-6" variant="outline">
                Continue to payment
              </ButtonCN>
            </form>
          </Form>
        </Fragment>
      )}
      {shippingAddress && showPayment && (
        <form onSubmit={handlePaymentSubmit} className={classes.form}>
          {error && <Message error={error} />}
          <PaymentElement />
          <div className={classes.actions}>
            <Button
              label={isLoading ? "Loading..." : "Checkout"}
              type="submit"
              appearance="primary"
              disabled={!stripe || isLoading}
            />{" "}
            <Button
              label="Back to shipping"
              el="button"
              onClick={() => setShowPayment(false)}
              appearance="secondary"
            />
          </div>
        </form>
      )}
    </div>
  );
};
export default CheckoutForm;
