"use client";

import { useEffect, useState } from "react";
import { CircleCheck, Clock } from "lucide-react";

import { Button } from "../../../_components/Button";
import { Gutter } from "../../../_components/Gutter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../../../_components/ui/card";
import getStripeCheckout from "../../../_utilities/getStripeCheckout";

const SuccessPage = ({ searchParams }) => {
  const session_id = searchParams?.session_id;
  const [data, setData] = useState(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (typeof session_id !== "string" || !session_id) {
      setError("Invalid order.");
    } else {
      getStripeCheckout(session_id)
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setData(data);
          }
        })
        .catch(err => {
          setError("An error occurred while fetching the session.");
        });
    }
  }, [session_id]);

  return (
    <Gutter>
      {error && <h2 className="text-red-500 text-2xl">{error}</h2>}
      {!error && !data && (
        <div className="mx-auto flex flex-col justify-center items-center text-center gap-8">
          <p className="m-0 p-0 text-3xl font-semibold">Loading order...</p>
          <Clock className="m-0 p-0 size-14" />
        </div>
      )}
      {!error && data && (
        <Card className="max-w-max mx-auto p-0 md:px-12 md:py-2">
          <CardHeader>
            <CircleCheck className="text-emerald-500 mx-auto size-24 md:size-32" />
            <CardDescription className="text-base text-center">Hey {data.name},</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold">Your order is confirmed!</h2>
            <p className="text-base md:text-lg max-w-lg">
              A confirmation mail has been sent and you will be contacted for further discussion
              about your order.
            </p>
          </CardContent>
          <CardFooter>
            <Button label="Your orders" href="/orders" appearance="primary" className="mx-auto" />
          </CardFooter>
        </Card>
      )}
    </Gutter>
  );
};

export default SuccessPage;
