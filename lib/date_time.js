function getIndianTime() {
  const now = new Date();

  // Format the current time in IST (Indian Standard Time)
  const indianTime = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3, // Milliseconds
    hour12: false, // 24-hour format
  }).format(now);

  // Extract components from the indianTime formatted string
  const [day, month, year, hour, minute, second, millisecond] = indianTime
    .match(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})\.(\d{3})/)
    .slice(1);

  // Create a new Date object in UTC based on the extracted components
  const indianDateUTC = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
  );

  // Convert to ISO 8601 format (UTC time)
  const isoDate = indianDateUTC.toISOString();

  return isoDate;
}

// console.log(getIndianTime());

module.exports = { getIndianTime };
