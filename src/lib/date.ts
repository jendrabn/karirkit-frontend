import dayjs from "dayjs";
import "dayjs/locale/id";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

// Set dayjs to use Indonesian locale
dayjs.locale("id");

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(relativeTime);

// Export dayjs instance with Indonesian locale configured
export { dayjs };

// Format date to Indonesian format
export const formatDate = (date: string | Date, format: string = "DD MMM YYYY"): string => {
  return dayjs(date).format(format);
};

// Format date to relative time (e.g., "2 days ago")
export const formatRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};
