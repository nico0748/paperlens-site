import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 共有データのアップロードは手元保存（STORAGE_DRIVER=local）のときだけサーバーを通る
  experimental: { serverActions: { bodySizeLimit: "200mb" } },
};

export default nextConfig;
