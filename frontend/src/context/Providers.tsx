"use client";

import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Aquí puedes envolver tus contextos globales, por ejemplo:
  // <AuthProvider><CartProvider>{children}</CartProvider></AuthProvider>
  return <>{children}</>;
}