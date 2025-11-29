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
console.log(inputDate.toDateString())
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

export default getMessageDate;
