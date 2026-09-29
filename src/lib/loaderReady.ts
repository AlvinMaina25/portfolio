import { createContext } from "react";

/**
 * "Has the loading screen started leaving?" PageLayout provides it; Reveal and useCountUp
 * wait for it so their entrance animations play once the page is actually visible rather
 * than behind the loader. The default is true, so these pieces still work on their own
 * (outside PageLayout, in isolation, or if the loader is ever removed).
 */
export const LoaderReadyContext = createContext<boolean>(true);
