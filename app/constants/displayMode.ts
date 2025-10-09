export const DISPLAY_MODE: Record<string, string> = {
  binary: "BINARY",
  decimal: "DECIMAL",
  chinese: "CHINESE",
};

export type DisplayMode = (typeof DISPLAY_MODE)[keyof typeof DISPLAY_MODE];
