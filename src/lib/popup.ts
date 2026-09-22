export type PopupPlatform = "WEBSITE" | "MOBILE" | "BOTH";
export type PopupType =
  | "ADVERTISEMENT"
  | "ANNOUNCEMENT"
  | "PROMOTION"
  | "INFORMATION";
export type PopupDisplayFrequency = "ONCE_PER_SESSION";

export interface Popup {
  id: string;
  title: string;
  description?: string;
  image?: string;
  type: PopupType;
  platform: PopupPlatform;
  button?: { text: string; url: string };
  delaySeconds: number;
  displayFrequency: PopupDisplayFrequency;
}

export interface ActivePopupsResponse {
  success: boolean;
  status: number;
  message: string;
  data: Popup[];
}

export async function getActiveWebsitePopups(signal: AbortSignal): Promise<Popup[]> {
  const apiOrigin = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");
  if (!apiOrigin) throw new Error("NEXT_PUBLIC_BASE_URL is not configured");

  const response = await fetch(`${apiOrigin}/popup/active?platform=WEBSITE`, {
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error(`Popup request failed: ${response.status}`);

  const result: ActivePopupsResponse = await response.json();
  if (!result.success || !Array.isArray(result.data)) {
    throw new Error(result.message || "Invalid popup response");
  }
  return result.data;
}
