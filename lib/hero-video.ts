export type ConnectionHint = {
  saveData?: boolean;
  effectiveType?: string;
};

export function shouldSkipHeroVideo(): boolean {
  if (typeof navigator === "undefined") return false;

  const nav = navigator as Navigator & {
    connection?: ConnectionHint;
    mozConnection?: ConnectionHint;
    webkitConnection?: ConnectionHint;
  };
  const connection =
    nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

  if (!connection) return false;
  if (connection.saveData) return true;
  const type = connection.effectiveType;
  return type === "slow-2g" || type === "2g" || type === "3g";
}

export function mapWindToRate(strength: number, gustPhase: number): number {
  if (gustPhase > 0.35) return 1.06;
  return 0.92 + strength * 0.14;
}
