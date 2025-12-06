const palette = [
  "#e67e22",
  "#d35400",
  "#c0392b",
  "#8e44ad",
  "#2980b9",
  "#16a085",
  "#27ae60",
  "#2ecc71",
  "#f39c12",
  "#f1c40f",
  "#e74c3c",
  "#9b59b6",
  "#3498db",
  "#1abc9c",
  "#2ecc71",
];
const adjectives = [
  "Quick",
  "Silent",
  "Mighty",
  "Blue",
  "Brave",
  "Calm",
  "Swift",
  "Clever",
  "Lucky",
  "Bright",
];
const animals = [
  "Fox",
  "Tiger",
  "Eagle",
  "Panda",
  "Wolf",
  "Hawk",
  "Lion",
  "Falcon",
  "Otter",
  "Bear",
];

function pickPaletteColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + 31 * hash;
  }
  return palette[Math.abs(hash) % palette.length];
}

function generateRandomName() {
  const adjective = adjectives[Math.floor(Math.random()*adjectives.length)];
  const animal = animals[Math.floor(Math.random()*animals.length)];
  const num = Math.floor(Math.random()*1000);

  return `${adjective}${animal}${num}`;
}

function otherAdminsExist(chat,userUid){
  const availableAdmins = chat.adminUids.filter((aUid)=> aUid != userUid);
  if (availableAdmins.length == 0) return false;

  return true;
}

export { pickPaletteColor,generateRandomName,otherAdminsExist };
