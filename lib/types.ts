export type ColorRole = "primary" | "secondary" | "accent" | "neutral";
export type FontRole = "headline" | "body" | "mono";
export type LogoVariant = "primary" | "reversed" | "mono" | "icon" | "favicon";
export type LogoFormat = "svg" | "png";
export type VerbalContext = "email" | "headline" | "cta" | "linkedin" | "error";

export type EventType =
  | "portal_opened"
  | "copied_color"
  | "downloaded_logo"
  | "copied_css"
  | "copied_token_block"
  | "copied_tone_example"
  | "copied_brand_bio"
  | "viewed_section";

export type Client = {
  id: string;
  slug: string;
  name: string;
  passcode: string;
  brand_bio: string | null;
  created_at: string;
};

export type BrandColor = {
  id: string;
  client_id: string;
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  role: ColorRole;
  sort_order: number;
};

export type BrandFont = {
  id: string;
  client_id: string;
  role: FontRole;
  family: string;
  weights: number[];
  css_import_url: string | null;
  storage_url: string | null;
};

export type Logo = {
  id: string;
  client_id: string;
  variant: LogoVariant;
  format: LogoFormat;
  storage_url: string;
  signedUrl?: string;
};

export type VerbalExample = {
  id: string;
  client_id: string;
  say_this: string;
  dont_say_this: string;
  context: VerbalContext;
};

export type AppliedExample = {
  ratio: string;
  meaning: string;
  example: string;
};

export type VibeCoordinates = {
  id: string;
  client_id: string;
  code: string;
  label: string;
  surface_pct: number;
  weight_pct: number;
  accent_pct: number;
  surface_name: string;
  weight_name: string;
  accent_name: string;
  description: string | null;
  applied_examples: AppliedExample[];
};

export type DeveloperTokens = {
  id: string;
  client_id: string;
  token_block: string;
};

export type Session = {
  unlockedAt: number;
  userLabel: string | null;
};

export type EnrichedClient = Client & {
  brand_colors: BrandColor[];
  logos: Logo[];
  brand_fonts: BrandFont[];
  developer_tokens: DeveloperTokens | null;
  vibe_coordinates: VibeCoordinates | null;
  verbal_examples: VerbalExample[];
};
