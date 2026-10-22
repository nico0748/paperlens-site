import { en } from "./en";
import { ja, type Dictionary } from "./ja";
import type { Locale } from "./config";

export * from "./config";
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { ja, en };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
