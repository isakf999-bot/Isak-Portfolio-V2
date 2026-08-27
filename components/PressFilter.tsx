export function PressFilter() {
  return (
    <svg
      className="press-svg"
      aria-hidden="true"
      width="0"
      height="0"
      focusable="false"
    >
      <filter id="press" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="2"
          seed="7"
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale="0.45"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
