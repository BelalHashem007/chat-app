const palette = [
  "#e67e22", "#d35400", "#c0392b", "#8e44ad",
  "#2980b9", "#16a085", "#27ae60", "#2ecc71",
  "#f39c12", "#f1c40f", "#e74c3c", "#9b59b6",
  "#3498db", "#1abc9c", "#2ecc71"
];

function pickPaletteColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + 31 * hash;
  }
  return palette[Math.abs(hash) % palette.length];
}

export {pickPaletteColor}