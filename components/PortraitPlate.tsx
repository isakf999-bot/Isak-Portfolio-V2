import Image from "next/image";

export function PortraitPlate() {
  return (
    <figure
      className="relative aspect-[4/5] overflow-hidden border border-ink bg-paper"
      data-portrait-plate
    >
      <Image
        src="/media/isak-portrait.png"
        alt="Isak Forsberg"
        fill
        sizes="(max-width: 1024px) 100vw, 420px"
        className="pointer-events-none select-none object-cover object-[center_18%]"
        priority
        draggable={false}
      />
    </figure>
  );
}
