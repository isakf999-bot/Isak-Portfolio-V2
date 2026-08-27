import { GlobeSkeleton } from "@/components/globe/GlobeSkeleton";

export function GlobeSlot({ className }: { className?: string }) {
  return (
    <div
      data-globe-slot
      className={`relative overflow-hidden bg-paper ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="globe-skeleton absolute inset-0" data-globe-skeleton>
        <GlobeSkeleton />
      </div>
    </div>
  );
}
