import Constants from "../../../../../../../app/state/slices/constants";

export const toastStyle = (type) => {
  switch (type) {
    case Constants.NotifyService.INFO:
      return "";

    case Constants.NotifyService.ALERT:
      return "text-warning";

    case Constants.NotifyService.ERROR:
      return "text-danger";

    default:
      return "";
  }
};

export const determineMargin = (unfilteredLength, pos, margin) => {
  if (unfilteredLength - 1 === pos) return "";

  return `mb-${margin}`;
};
