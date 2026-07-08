"use client";

import { shouldSuppressErrorToast } from "@/lib/apiErrorToast";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ToastErrorGuard() {
  useEffect(() => {
    const originalError = toast.error;

    toast.error = (message, options) => {
      const text =
        typeof message === "string" ? message : String(message ?? "");

      if (shouldSuppressErrorToast(text)) {
        return "";
      }

      return originalError(message, options);
    };

    return () => {
      toast.error = originalError;
    };
  }, []);

  return null;
}
