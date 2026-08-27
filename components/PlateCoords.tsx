import { plateCoords } from "@/lib/plate";

export function PlateCoords({ className }: { className?: string }) {
  return (
    <p className={`plate-coords ${className ?? ""}`} data-plate-coords>
      {plateCoords}
    </p>
  );
}
