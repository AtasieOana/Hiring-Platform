import { useTranslation } from "react-i18next";
import { calculateTimeDifference } from "../common/CommonMethods";

const JobTime = (postingDate) => {
  const { t, i18n } = useTranslation();

  let timeDifference = calculateTimeDifference(postingDate.postingDate);
  if (timeDifference.months === 1) {
    return "1 " + t("month") + " ";
  } else if (timeDifference.months > 1) {
    return timeDifference.months + " " + t("months") + " ";
  } else if (timeDifference.weeks === 1) {
    return "1 " + t("week") + " ";
  } else if (timeDifference.weeks > 1) {
    return timeDifference.weeks + " " + t("weeks") + " ";
  } else if (timeDifference.days === 1) {
    return "1 " + t("day") + " ";
  } else if (timeDifference.days > 1) {
    return timeDifference.days + " " + t("days") + " ";
  } else if (timeDifference.hours === 0) {
    return "<1 " + t("hour") + " ";
  } else if (timeDifference.hours === 1) {
    return "1 " + t("hour") + " ";
  } else {
    return timeDifference.hours + " " + t("hours") + " ";
  }
};

export default JobTime;
