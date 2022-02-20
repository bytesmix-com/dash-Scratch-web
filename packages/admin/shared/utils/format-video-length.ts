import { secondsToMinutes } from "date-fns";

export const formatVideoLength = (lengthInSeconds: number) => {
  const minutes = secondsToMinutes(lengthInSeconds);
  const seconds = lengthInSeconds - 60 * minutes;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};
