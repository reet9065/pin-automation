function getIndianTime() {
  const now = new Date();
  const indianTime = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3, // To include milliseconds
    hour12: false, // 24-hour format
  }).format(now);

  // Format the date in ISO 8601 format (e.g., 2024-12-09T14:35:22.123Z)
  const date = new Date(indianTime); // Convert formatted time back to Date object
  const isoDate = date.toISOString(); // Convert to ISO format (with UTC timezone)

  return isoDate;
}



// console.log(getIndianTime());

module.exports = {getIndianTime};