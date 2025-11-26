function DefaultImage({ text }) {
  console.log(text)
  if (!text) return;
  
  const firstLetter = text.slice(0, 1).toUpperCase();
  const bgColor = generateRandomHexColor(text);
  const color = getBrightness(bgColor) > 128 ? "#000000" : "#FFFFFF";

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: color,
        borderRadius: "50%",
        flexGrow: 1,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        fontWeight:"700"
      }}
    >
      {firstLetter}
    </div>
  );
}

function generateRandomHexColor(str) {
  //hashing
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + 31 * hash;
    hash |= 0; //convert to 32bit integer
  }

  let randomColor = (hash & 0xffffff).toString(16); //ensures 24 bit-number clears any bit higher and converts to hexdecimal
  randomColor = `#${randomColor.padStart(6, "0")}`;

  return randomColor;
}

function getBrightness(hex) {
  // remove #
  hex = hex.replace("#", "");

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // formula for relative luminance
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export default DefaultImage;
