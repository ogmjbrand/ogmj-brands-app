"use client";
import { Hub } from "@/components/modules/Hub";

export default function GrowHub() {
  return (
    <Hub
      eyebrow="Launch · Market"
      title="Get it in front of people"
      lede="Content in your voice, scheduled where your audience is, wrapped in campaigns that pay for themselves."
      modules={["content", "social", "marketing"]}
      handoff={
        <>
          <strong className="text-[#f4f6f5] font-semibold">Content</strong> writes in the voice your
          Brand defined. <strong className="text-[#f4f6f5] font-semibold">Social</strong> schedules it
          at the hours your analytics say convert.{" "}
          <strong className="text-[#f4f6f5] font-semibold">Marketing</strong> turns the pieces that
          perform into paid campaigns, and every lead they produce lands in your CRM already tagged
          with the post that earned it.
        </>
      }
    />
  );
}
