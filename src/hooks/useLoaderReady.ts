import { use } from "react";
import { LoaderReadyContext } from "@/lib/loaderReady";

/** True once the loading screen has begun to leave (always true without a provider). */
export function useLoaderReady(): boolean {
  return use(LoaderReadyContext);
}
