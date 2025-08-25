"use client";

import { useEffect } from "react";

export default function FetchInterceptor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : (input as Request).url || "";

      if (url && (url.includes("/api/v1/cart") || url.endsWith("/cart"))) {
        const stack = new Error().stack;
        console.warn("Blocked cart API call to:", url);
        console.debug("Stack trace:", stack);
        return Promise.reject(
          new Error("Cart functionality is removed in the storefront")
        );
      }

      return originalFetch(input as any, init as any);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
