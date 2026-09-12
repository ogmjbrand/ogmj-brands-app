"use client";
import { Hub } from "@/components/modules/Hub";

export default function RevenueHub() {
  return (
    <Hub
      eyebrow="Sell · Grow"
      title="Turn attention into revenue"
      lede="Every lead, every deal, every naira — traced back to the post, page or campaign that created it."
      modules={["crm", "analytics", "services"]}
      handoff={
        <>
          <strong className="text-[#f4f6f5] font-semibold">CRM</strong> holds the relationships;{" "}
          <strong className="text-[#f4f6f5] font-semibold">Analytics</strong> explains which of your
          work created them. When you&apos;d rather hand a piece of this to people who do it full-time,{" "}
          <strong className="text-[#d4af37] font-semibold">Services</strong> brings in the OGMJ team.
        </>
      }
    />
  );
}
