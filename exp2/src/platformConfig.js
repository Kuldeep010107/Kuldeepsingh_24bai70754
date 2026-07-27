export const PLATFORMS = {
  twitter: { id: "twitter", name: "Twitter", icon: "🐦", limit: 280 },
  facebook: { id: "facebook", name: "Facebook", icon: "📘", limit: 63206 },
  instagram: { id: "instagram", name: "Instagram", icon: "📸", limit: 2200 },
  linkedin: { id: "linkedin", name: "LinkedIn", icon: "💼", limit: 1300 },
};

export function validate(text, media, selectedPlatforms) {
  const errors = {};
  const warnings = {};
  const trimmed = text.trim();

  selectedPlatforms.forEach((platformId) => {
    const platform = PLATFORMS[platformId];
    if (!platform) return;

    if (!trimmed) {
      errors[platformId] = ["Post content is required for this platform."];
      return;
    }

    if (trimmed.length > platform.limit) {
      errors[platformId] = [
        `Text exceeds ${platform.limit} characters for ${platform.name}.`,
      ];
    } else if (trimmed.length > platform.limit * 0.85) {
      warnings[platformId] = [
        `Text is nearing the ${platform.limit}-character limit for ${platform.name}.`,
      ];
    }

    if (media.length > 4) {
      warnings[platformId] = [
        ...(warnings[platformId] || []),
        "More than 4 media items may not be supported on all platforms.",
      ];
    }
  });

  return { errors, warnings };
}
