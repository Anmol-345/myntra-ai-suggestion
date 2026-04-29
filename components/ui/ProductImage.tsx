interface ProductImageProps {
  name: string;
  category: string;
  id: string;
}

// Color palettes keyed by category
const PALETTES: Record<string, { bg: string; text: string; accent: string }> = {
  "men": { bg: "#1e3a5f", text: "#e2eaf5", accent: "#4a90d9" },
  "women": { bg: "#5f1e3a", text: "#f5e2ea", accent: "#d94a90" },
  "jewelery": { bg: "#3a3a1e", text: "#f5f0e2", accent: "#d9c44a" },
  "default": { bg: "#1e2d3a", text: "#e2eef5", accent: "#4ab4d9" },
};

function getPalette(category: string) {
  const key = Object.keys(PALETTES).find(k => category.toLowerCase().includes(k));
  return PALETTES[key ?? "default"];
}

// Wrap text into lines of maxChars
function wrapText(text: string, maxChars = 18): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
    if (lines.length === 3) break; // max 3 lines
  }
  if (current && lines.length < 3) lines.push(current);
  return lines;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export default function ProductImage({ name, category, id }: ProductImageProps) {
  const { bg, text, accent } = getPalette(category);
  const safeName = escapeXml(name);
  const safeCategory = escapeXml(category);
  const lines = wrapText(safeName);
  const totalLines = lines.length;
  const lineHeight = 28;
  const blockHeight = totalLines * lineHeight;
  const startY = (300 - blockHeight) / 2;

  // Unique gradient id per product to avoid SVG conflicts
  const gradId = `grad-${id}`;

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${accent}33;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="300" height="400" fill="url(#${gradId})" />

      <!-- Grid lines for texture -->
      ${Array.from({ length: 10 }, (_, i) =>
    `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="400" stroke="${text}08" stroke-width="1"/>`
  ).join("")}
      ${Array.from({ length: 14 }, (_, i) =>
    `<line x1="0" y1="${i * 30}" x2="300" y2="${i * 30}" stroke="${text}08" stroke-width="1"/>`
  ).join("")}

      <!-- Accent circle -->
      <circle cx="250" cy="50" r="80" fill="${accent}" opacity="0.08"/>
      <circle cx="50" cy="360" r="60" fill="${accent}" opacity="0.08"/>

      <!-- Category badge -->
      <rect x="20" y="20" width="${category.length * 9 + 16}" height="26" rx="13" fill="${accent}33"/>
      <text x="28" y="37" font-family="system-ui,sans-serif" font-size="11" font-weight="700"
        fill="${accent}" letter-spacing="1">${safeCategory.toUpperCase()}</text>

      <!-- Product name lines -->
      ${lines.map((line, i) => `
        <text
          x="150"
          y="${startY + i * lineHeight + lineHeight * 0.75}"
          font-family="system-ui,sans-serif"
          font-size="20"
          font-weight="800"
          fill="${text}"
          text-anchor="middle"
          letter-spacing="-0.5"
        >${line}</text>
      `).join("")}

      <!-- Bottom accent bar -->
      <rect x="0" y="375" width="300" height="4" fill="${accent}" opacity="0.6"/>
      <text x="150" y="395" font-family="system-ui,sans-serif" font-size="10"
        fill="${text}66" text-anchor="middle">Myntra</text>
    </svg>
  `.trim();

  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUri}
      alt={name}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
}
