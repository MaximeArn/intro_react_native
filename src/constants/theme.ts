// Identité visuelle « marché » : fond crème, vert forêt, accent terracotta

export const colors = {
  background: "#FAF6EC", // crème
  surface: "#FFFFFF",
  surfaceMuted: "#F1EBDA",
  border: "#E4DCC6",

  primary: "#2F5D3A", // vert forêt
  primaryPressed: "#244A2E",
  primarySoft: "#E3EDDF",
  primaryDisabled: "#A9BFA9",

  accent: "#C8553D", // terracotta
  accentSoft: "#F6E1DA",

  text: "#1F2A22",
  textMuted: "#6B7268",
  onPrimary: "#FFFFFF",
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: { fontSize: 30, fontWeight: "800", color: colors.text },
  heading: { fontSize: 18, fontWeight: "700", color: colors.text },
  body: { fontSize: 16, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
  overline: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
} as const;

// "shadow*" est déprécié au profit de boxShadow
export const shadow = {
  card: { boxShadow: "0 2px 10px rgba(47, 93, 58, 0.08)" },
  button: { boxShadow: "0 4px 12px rgba(47, 93, 58, 0.25)" },
};
