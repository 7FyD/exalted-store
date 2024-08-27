"use client";

import React from "react";

import { Toaster } from "../_components/ui/toaster";
import { AuthProvider } from "./Auth";
import { CartProvider } from "./Cart";
import { FilterProvider } from "./Filter";
import { QueryProvider } from "./Query";
import { ThemeProvider } from "./Theme";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <FilterProvider>
            <CartProvider>{children}</CartProvider>
            <Toaster />
          </FilterProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
