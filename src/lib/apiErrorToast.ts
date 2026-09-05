import toast from "react-hot-toast";

type ApiError = {
  status?: number | string;
  error?: string;
  message?: string;
  data?: {
    isTokenExpired?: boolean;
    message?: string;
    data?: { message?: string };
  } | string;
};

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") return fallback;

  const err = error as ApiError;
  const data = err.data;

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }
    if (typeof data.data?.message === "string" && data.data.message.trim()) {
      return data.data.message.trim();
    }
  }

  if (typeof data === "string" && data.trim()) {
    try {
      const parsed = JSON.parse(data) as { message?: unknown };
      if (typeof parsed?.message === "string" && parsed.message.trim()) {
        return parsed.message.trim();
      }
    } catch {
      // Keep looking at other fields instead of showing raw HTML/text.
    }
  }

  if (
    typeof err.message === "string" &&
    err.message.trim() &&
    err.message !== "Rejected"
  ) {
    return err.message.trim();
  }

  if (typeof err.error === "string" && err.error.trim()) {
    return err.error.trim();
  }

  return fallback;
}

let tokenExpiredActive = false;

const TOKEN_EXPIRED_MESSAGE_PATTERNS = [
  /access denied/i,
  /token has expired/i,
  /token expired/i,
  /unauthorized/i,
];

export function isTokenExpiredError(error: unknown): boolean {
  const err = error as ApiError;
  if (err?.status === 401) return true;
  const data = err?.data;
  return typeof data === "object" && data?.isTokenExpired === true;
}

export function shouldSuppressErrorToast(message: string): boolean {
  if (tokenExpiredActive) return true;
  return TOKEN_EXPIRED_MESSAGE_PATTERNS.some((pattern) =>
    pattern.test(message),
  );
}

export function clearTokenExpiredState(): void {
  tokenExpiredActive = false;
}

export function notifyTokenExpired(message?: string): void {
  if (tokenExpiredActive) return;

  tokenExpiredActive = true;
  toast.dismiss();

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("tokenExpired", {
        detail: {
          message: message || "Access denied. Token has expired.",
        },
      }),
    );
  }
}

export function showApiErrorToast(error: unknown, fallback: string): void {
  if (isTokenExpiredError(error)) return;

  const message = extractApiErrorMessage(error, fallback);
  if (shouldSuppressErrorToast(message)) return;

  toast.error(message);
}
