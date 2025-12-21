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
