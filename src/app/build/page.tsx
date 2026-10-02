"use client";

import { Hub } from "@/components/modules/Hub";

export default function BuildHub() {
  return (
    <Hub
      eyebrow="Create · Build"
      title="Build the thing itself"
      lede="Your brand is the source. Everything downstream — the site, the assets, the copy — inherits from it automatically."
      modules={["brand", "website", "studio"]}
      handoff={
        <>
          Your <strong className="text-[#f4f6f5] font-semibold">Brand</strong> defines the palette,
          voice and positioning that <strong className="text-[#f4f6f5] font-semibold">Website</strong>{" "}
          and <strong className="text-[#f4f6f5] font-semibold">Design Studio</strong> draw from. Change
          the brand once and every asset, page and caption updates to match — you never restyle
          anything twice.
        </>
      }
    />
  );
}
