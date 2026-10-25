import { featuresEn } from "@/lib/i18n/features-en";
import { featuresJa, type FeaturesDictionary } from "@/lib/i18n/features-ja";

export function getFeaturesDictionary(lang: "ja" | "en"): FeaturesDictionary {
  return lang === "ja" ? featuresJa : featuresEn;
}
