import toast from "react-hot-toast";

type ApiError = {
  status?: number;
  data?: {
    isTokenExpired?: boolean;
    message?: string;
  };
};

let tokenExpiredActive = false;

const TOKEN_EXPIRED_MESSAGE_PATTERNS = [
  /access denied/i,
  /token has expired/i,
  /token expired/i,
  /unauthorized/i,
];

export function isTokenExpiredError(error: unknown): boolean {
  const err = error as ApiError;
  return err?.status === 401 || err?.data?.isTokenExpired === true;
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

  const err = error as ApiError;
  const message = err?.data?.message || fallback;
  if (shouldSuppressErrorToast(message)) return;

  toast.error(message);
}
