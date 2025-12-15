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
  if (!(typeof str == "string") || !(str instanceof String)) return palette[0];
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

function getMessageDate(timestamp,options = { forChatWindow: false }) {
  if (!timestamp) return;
  const inputDate = new Date(timestamp.seconds * 1000);
  const currentDate = new Date();

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const timeDifference = currentDate - inputDate;
  const daysDiff = Math.floor(timeDifference / oneDayInMilliseconds);


  const isToday = inputDate.toDateString() === currentDate.toDateString();
  
  const isYesterday =
    new Date(currentDate - oneDayInMilliseconds).toDateString() ===
    inputDate.toDateString();
  const timeString = inputDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (isToday) {
    return timeString; // "14:32"
  }
  
  if (isYesterday) {
    return options.forChatWindow ? `Yesterday, ${timeString}` : "Yesterday";
  }

  if (daysDiff < 7 && options.forChatWindow) {
    // Show day of week + time
    return `${inputDate.toLocaleDateString([], { weekday: "short" })}, ${timeString}`;
  }

  if (options.forChatWindow) {
    return inputDate.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  } else {
    // for contact list, shorter
    return inputDate.toLocaleDateString([], { month: "short", day: "numeric" });
  }

}

export { pickPaletteColor,generateRandomName,otherAdminsExist,getMessageDate };
