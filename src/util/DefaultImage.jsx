import { pickPaletteColor } from "./utilFunctions";

function DefaultImage({ text }) {
  if (!text) return;
  
  const firstLetter = text.slice(0, 1).toUpperCase();
  const bgColor = pickPaletteColor(text);

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: "white",
        borderRadius: "50%",
        flexGrow: 1,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        fontWeight:"700",
      }}
    >
      {firstLetter}
    </div>
  );
}



export default DefaultImage;
