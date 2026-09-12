import { EnergyOrb } from "@/components/ui/Energy";
import { Button } from "@/components/ui/Button";

/**
 * Even the 404 is a surface of the product. Nothing here says "error" —
 * a wrong URL is not the user's failure and should not be framed as one.
 */
export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-start justify-center gutter pb-nav">
      <EnergyOrb size={80} state="idle" />
      <p className="eyebrow text-[#8b9491] mt-8">Nothing here</p>
      <h1 className="mt-4 editorial text-[2.25rem] lg:text-[3rem] leading-[1.05] text-gradient-em max-w-[16ch]">
        This part of your business doesn&apos;t exist yet.
      </h1>
      <p className="mt-4 text-[13px] leading-[1.65] text-[#a3adaa] max-w-[40ch]">
        Which is usually a good sign — it means there is still something to build.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
        <Button href="/" size="lg" icon="arrow">
          Back to your dashboard
        </Button>
        <Button href="/create" size="lg" variant="outline" icon="spark" iconSide="left">
          Build something
        </Button>
      </div>
    </div>
  );
}
