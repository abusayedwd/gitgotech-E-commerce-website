"use client";

import { usePlatformFreeQuery } from "@/redux/features/settings/settingsSlice";

/** Warms the RTK Query cache for GET /platform-setting on every app load. */
export default function PlatformSettingsPrefetch() {
  usePlatformFreeQuery(undefined);
  return null;
}
