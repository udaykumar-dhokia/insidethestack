"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toast } from "@heroui/react";
import StoreProvider from "./StoreProvider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <StoreProvider>
      <NextThemesProvider {...themeProps}>
        {children}
      </NextThemesProvider>
      <Toast.Provider placement="bottom-right" />
    </StoreProvider>
  );
}
