"use client"

import { ReactNode } from "react";
import { ConfigProvider } from "./ConfigurationContext";

export default function ConfigWrapped({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  )
}