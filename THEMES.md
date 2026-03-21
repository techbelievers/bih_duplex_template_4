# Color themes reference (Real estate – all templates)

The template supports **16 color themes** via the API field `color_theme` (or `colorTheme`) with values **1–16**. The app applies the matching class (e.g. `theme-1`) on the root wrapper so all components use the same palette. Use this list in the backend as the single source of truth for theme IDs and names.

---

## Quick reference (for backend dropdown / DB)

| ID | Theme name | Primary (hex) | Accent (hex) | Best for |
|----|------------|---------------|--------------|----------|
| 1 | Classic Gold & Navy | #1a1d29 | #c9a227 | Traditional luxury, corporate |
| 2 | Teal & Slate | #0f172a | #0d9488 | Modern, coastal, sustainable |
| 3 | Burgundy & Wine | #1e0a0f | #9f2d3a | Premium residential, warm |
| 4 | Forest & Bronze | #0c1810 | #b8860b | Eco, nature, landed |
| 5 | Indigo & Amber | #1e1b4b | #d97706 | Contemporary, bold |
| 6 | Charcoal & Rose Gold | #1c1917 | #b76e79 | Soft luxury, lifestyle |
| 7 | Midnight & Copper | #0f1419 | #b87333 | Industrial luxury, lofts |
| 8 | Ocean & Coral | #0c4a6e | #e11d48 | Coastal, resort, vacation |
| 9 | Sand & Espresso | #292524 | #b45309 | Neutral warm, minimal, universal |
| 10 | Royal Blue & Gold | #1e3a5f | #d4a017 | Trust, institutional, premium |
| 11 | Sage & Terracotta | #1c3329 | #c2410c | Mediterranean, earth, villas |
| 12 | Graphite & Lime | #171717 | #65a30d | Modern, tech, young buyers |
| 13 | Plum & Champagne | #3b0764 | #fcd34d | Luxury, exclusive, high-end |
| 14 | Steel & Crimson | #334155 | #dc2626 | Bold, corporate, strong CTA |
| 15 | Ivory & Olive | #27342a | #84a98c | Calm, natural, wellness |
| 16 | Onyx & Brass | #0c0c0c | #b5a642 | Ultra luxury, black & gold |

---

## Full theme details

### Theme 1: Classic Gold & Navy
**Primary:** #1a1d29 · **Accent:** #c9a227 · **Light:** #d4af37 · **Dark:** #a8861f  
Best for: Traditional luxury, corporate real estate, high-end listings.

### Theme 2: Teal & Slate
**Primary:** #0f172a · **Accent:** #0d9488 · **Light:** #14b8a6 · **Dark:** #0f766e  
Best for: Modern, calm, coastal or sustainability-focused projects.

### Theme 3: Burgundy & Wine
**Primary:** #1e0a0f · **Accent:** #9f2d3a · **Light:** #b83d4a · **Dark:** #7c232e  
Best for: Premium residential, wine-country or warm luxury.

### Theme 4: Forest & Bronze
**Primary:** #0c1810 · **Accent:** #b8860b · **Light:** #daa520 · **Dark:** #8b6914  
Best for: Green/nature projects, eco-luxury, landed properties.

### Theme 5: Indigo & Amber
**Primary:** #1e1b4b · **Accent:** #d97706 · **Light:** #f59e0b · **Dark:** #b45309  
Best for: Contemporary, bold contrast, premium commercial.

### Theme 6: Charcoal & Rose Gold
**Primary:** #1c1917 · **Accent:** #b76e79 · **Light:** #e8a0a8 · **Dark:** #9e5a64  
Best for: Soft luxury, lifestyle brands, aspirational residential.

### Theme 7: Midnight & Copper
**Primary:** #0f1419 · **Accent:** #b87333 · **Light:** #cd7f32 · **Dark:** #8b5a2b  
Best for: Industrial luxury, lofts, urban premium.

### Theme 8: Ocean & Coral
**Primary:** #0c4a6e · **Accent:** #e11d48 · **Light:** #f43f5e · **Dark:** #be123c  
Best for: Coastal, resort, vacation and beach properties.

### Theme 9: Sand & Espresso
**Primary:** #292524 · **Accent:** #b45309 · **Light:** #d97706 · **Dark:** #92400e  
Best for: Neutral warm, minimal, works for any segment.

### Theme 10: Royal Blue & Gold
**Primary:** #1e3a5f · **Accent:** #d4a017 · **Light:** #e6b800 · **Dark:** #b8860b  
Best for: Trust, institutional, banks, premium developers.

### Theme 11: Sage & Terracotta
**Primary:** #1c3329 · **Accent:** #c2410c · **Light:** #ea580c · **Dark:** #9a3412  
Best for: Mediterranean, earth tones, villas, farmhouses.

### Theme 12: Graphite & Lime
**Primary:** #171717 · **Accent:** #65a30d · **Light:** #84cc16 · **Dark:** #4d7c0f  
Best for: Modern, tech-savvy, young buyers, startups.

### Theme 13: Plum & Champagne
**Primary:** #3b0764 · **Accent:** #fcd34d · **Light:** #fde68a · **Dark:** #f59e0b  
Best for: Luxury, exclusive, ultra high-end positioning.

### Theme 14: Steel & Crimson
**Primary:** #334155 · **Accent:** #dc2626 · **Light:** #ef4444 · **Dark:** #b91c1c  
Best for: Bold, corporate, strong call-to-action.

### Theme 15: Ivory & Olive
**Primary:** #27342a · **Accent:** #84a98c · **Light:** #a7c4a8 · **Dark:** #52796f  
Best for: Calm, natural, wellness, spa-like projects.

### Theme 16: Onyx & Brass
**Primary:** #0c0c0c · **Accent:** #b5a642 · **Light:** #c9b858 · **Dark:** #8b7355  
Best for: Ultra luxury, black & gold, penthouse positioning.

---

## API usage

- **Endpoint:** Template API (e.g. `GET .../template?website=...`).
- **Field:** `color_theme` or `colorTheme` (integer **1–16**).
- **Default:** If missing or invalid, theme **1** (Classic Gold & Navy) is used.

Example response:

```json
{
  "templateId": "3",
  "color_theme": 2
}
```

Backend can store theme ID (1–16) and optionally the theme name from the table above for admin display.
