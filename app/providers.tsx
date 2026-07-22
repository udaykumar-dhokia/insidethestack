"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import StoreProvider from "./StoreProvider";
import { ToastProvider } from "@heroui/toast";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <StoreProvider>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      <ToastProvider placement="bottom-right" />
    </StoreProvider>
  );
}
