"use client";

import PlatformSettingsPrefetch from "@/components/providers/PlatformSettingsPrefetch";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "./store/store";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PlatformSettingsPrefetch />
      {children}
    </Provider>
  );
}
