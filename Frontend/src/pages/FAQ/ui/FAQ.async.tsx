import { lazy } from "react";

export const FAQPageAsync = lazy(async () => import("./FAQ.tsx"));
