"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { Message } from "../../../_components/Message";
import { Button } from "../../../_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../_components/ui/form";
import { Input } from "../../../_components/ui/input";
import { useAuth } from "../../../_providers/Auth";

const formSchema = z.object({
  email: z.optional(z.string().email("Please enter a valid email")).or(z.literal("")),
  name: z
    .optional(
      z
        .string()
        .min(2, "Please enter a name of at least 2 characters")
        .max(64, "Please enter a name of maximum 64 characters"),
    )
    .or(z.literal("")),
  password: z
    .optional(
      z
        .string()
        .min(2, "Please enter a password of at least 2 characters")
        .max(64, "Please enter a password of maximum 64 characters"),
    )
    .or(z.literal("")),
  confirmPassword: z
    .optional(
      z
        .string()
        .min(2, "Please enter a password of at least 2 characters")
        .max(64, "Please enter a password of maximum 64 characters"),
    )
    .or(z.literal("")),
});

const AccountForm: React.FC = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          "You must be logged in to view this page.",
        )}&redirect=${encodeURIComponent("/account")}`,
      );
    }

    if (user) {
      form.reset({
        email: user.email,
        name: user.name,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, router, form]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      setError("");
      setSuccess("");
      setIsPending(true);
      if (form.watch("password") !== form.watch("confirmPassword")) {
        setError("New passwords don't match.");
        setIsPending(false);
      } else {
        if (user) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
            {
              credentials: "include",
              method: "PATCH",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (response.ok) {
            const json = await response.json();
            setUser(json.doc);
            setSuccess("Successfully updated account.");
            setError("");
            form.reset({
              email: user.email,
              name: user.name,
              password: "",
              confirmPassword: "",
            });
          } else {
            setError("There was a problem updating your account.");
          }
        }
        setIsPending(false);
      }
    },
    [user, setUser, form],
  );

  // if (!user) {
  //   return (
  //     <div className="mx-auto flex flex-col justify-center items-center gap-8">
  //       <p>Loading user...</p>
  //       <MoonLoader loading={true} />
  //     </div>
  //   );
  // }

  return (
    <Form {...form}>
      {!user ? (
        <div className="mx-auto flex flex-col justify-center items-center text-center gap-8">
          <p className="m-0 p-0">Loading user...</p>
          <Clock className="m-0 p-0 size-8" />
        </div>
      ) : (
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Message error={error} success={success} />
          <h2 className="font-semibold text-2xl mt-4">General details</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h2 className="font-semibold text-2xl">Password</h2>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="******"
                    displayShowPassword={!!field.value.length}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="******"
                    displayShowPassword={!!field.value.length}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} variant="default">
            {isPending ? "Processing" : "Update Account"}
          </Button>
        </form>
      )}
    </Form>
  );
};

export default AccountForm;
