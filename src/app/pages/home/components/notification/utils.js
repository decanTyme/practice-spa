import Constants from "../../../../state/slices/constants";

export const determineToastStyle = (type) => {
  switch (type) {
    case Constants.SUCCESS:
      return "bg-success border-success text-white";

    case Constants.NotifyService.INFO:
      return "";

    case Constants.NotifyService.ALERT:
      return "bg-warning border-warning text-white";

    case Constants.NotifyService.ERROR:
      return "bg-danger border-danger text-white";

    default:
      return "";
  }
};

export const determineDismissBtnStyle = (type) => {
  switch (type) {
    case Constants.SUCCESS:
      return "btn-close-white";

    case Constants.NotifyService.INFO:
      return "";

    case Constants.NotifyService.ALERT:
      return "";

    case Constants.NotifyService.ERROR:
      return "";

    default:
      return "";
  }
};

export const toastStyle = (type) => {
  switch (type) {
    case Constants.SUCCESS:
      return "text-success";

    case Constants.NotifyService.INFO:
      return "text-info";

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
