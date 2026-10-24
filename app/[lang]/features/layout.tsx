import "../features.css";
import { FeatureMotion } from "@/components/features/FeatureMotion";

/** 機能の一覧と詳細ページの共通部分（スタイルとスクロールの動き） */
export default function FeaturesLayout({ children }: LayoutProps<"/[lang]/features">) {
  return (
    <>
      {children}
      <FeatureMotion />
    </>
  );
}
