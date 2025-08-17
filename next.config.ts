import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const csp = [
      "default-src 'self'",
      "frame-src https://huggingface.co https://hf.space https://*.hf.space 'self'",
      "child-src https://huggingface.co https://hf.space https://*.hf.space 'self'",
      "connect-src 'self' https://huggingface.co https://hf.space https://*.hf.space",
      "img-src 'self' data: blob: https://huggingface.co https://hf.space https://*.hf.space",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://huggingface.co https://hf.space",
      "style-src 'self' 'unsafe-inline'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

export default nextConfig;
