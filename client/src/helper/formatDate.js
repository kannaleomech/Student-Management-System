const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // Outputs DD/MM/YYYY
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  // Format date as DD/MM/YYYY
  const formattedDate = date.toLocaleDateString("en-GB");

  // Format time as hh:mm:ss AM/PM
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Enables 12-hour format with AM/PM
  });

  return `${formattedDate} ${formattedTime}`;
};

export { formatDate, formatDateTime };