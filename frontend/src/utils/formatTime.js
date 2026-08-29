export const formatTime = (timeStr) => {

  // ← Old data has no time
  if (!timeStr) return "Not Available";

  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${ampm}`;
};