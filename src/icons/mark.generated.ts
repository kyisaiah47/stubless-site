/* GENERATED FILE. DO NOT EDIT, AND DO NOT DRAW THIS MARK ANYWHERE ELSE.
 *
 * Written by compound-ops/brand/app-icons/sync.mjs out of
 * compound-ops/brand/app-icons/icons/stubless-site.svg, which is the estate's ONE source for this
 * app's mark. The browser tab, this app's own header and the product tile on the studio site
 * are the same drawing because all three are fed from that file. To change the mark, change it
 * there and run:
 *
 *   node ~/CompoundLabs/compound-ops/brand/app-icons/sync.mjs
 *
 * compound-ops/tools/gates/one-logo-per-app.mjs fails the nightly sweep when this file stops
 * matching the registry, or when a component starts drawing the mark by hand again.
 */
export const MARK_SLUG = "stubless-site";
export const MARK_VIEWBOX = "0 0 64 64";
export const MARK_WIDTH = 64;
export const MARK_HEIGHT = 64;
/** The root <svg>'s own fill, where the registry file sets one. */
export const MARK_ROOT_FILL: string | null = null;
/** The ink the glyph is painted in, this product's accent. null when it draws in currentColor. */
export const MARK_INK: string | null = "#6FB8F9";
/** Everything inside the registry file's own <svg>. */
export const MARK_INNER = "<rect width=\"64\" height=\"64\" rx=\"10\" fill=\"#090a0b\"/><path d=\"M17 10h22l9 9v35H17z\" fill=\"#6FB8F9\"/><path d=\"M39 10v10h9\" fill=\"#82CBFF\"/><path d=\"M23 25h17M23 32h17M23 39h10\" stroke=\"#090a0b\" stroke-width=\"3\" stroke-linecap=\"square\"/><path d=\"M11 45h42\" stroke=\"#E6F4FF\" stroke-width=\"4\" stroke-linecap=\"square\"/>";
/** The plate the family paints behind the glyph, where this mark has one. */
export const MARK_PLATE: string | null = "<rect width=\"64\" height=\"64\" rx=\"10\" fill=\"#090a0b\"/>";
/** The glyph without that plate, for a header that paints its own ground. */
export const MARK_GLYPH = "<path d=\"M17 10h22l9 9v35H17z\" fill=\"#6FB8F9\"/><path d=\"M39 10v10h9\" fill=\"#82CBFF\"/><path d=\"M23 25h17M23 32h17M23 39h10\" stroke=\"#090a0b\" stroke-width=\"3\" stroke-linecap=\"square\"/><path d=\"M11 45h42\" stroke=\"#E6F4FF\" stroke-width=\"4\" stroke-linecap=\"square\"/>";
/** The registry file entire, for a header that injects the whole mark. */
export const MARK_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><rect width=\"64\" height=\"64\" rx=\"10\" fill=\"#090a0b\"/><path d=\"M17 10h22l9 9v35H17z\" fill=\"#6FB8F9\"/><path d=\"M39 10v10h9\" fill=\"#82CBFF\"/><path d=\"M23 25h17M23 32h17M23 39h10\" stroke=\"#090a0b\" stroke-width=\"3\" stroke-linecap=\"square\"/><path d=\"M11 45h42\" stroke=\"#E6F4FF\" stroke-width=\"4\" stroke-linecap=\"square\"/></svg>";

/** The same markup with the ink swapped, for a header that recolours the mark. */
export function markInner(color?: string): string {
  return color && MARK_INK ? MARK_INNER.split(MARK_INK).join(color) : MARK_INNER;
}

/** The glyph alone, ink swapped the same way. */
export function markGlyph(color?: string): string {
  return color && MARK_INK ? MARK_GLYPH.split(MARK_INK).join(color) : MARK_GLYPH;
}
