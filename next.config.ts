import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-pageflip (StPageFlip) binds its flip handlers to real DOM nodes on
  // mount; StrictMode's dev-only mount→unmount→remount leaves them on stale
  // nodes, so the book renders but won't flip. Off = flips work in dev.
  // (StrictMode only double-invokes in dev; production is unaffected.)
  reactStrictMode: false,
};

export default nextConfig;
