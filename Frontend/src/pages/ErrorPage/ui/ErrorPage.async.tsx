import { lazy } from "react";

export const ErrorPageAsync = lazy(async () => import("./ErrorPage.tsx"));
