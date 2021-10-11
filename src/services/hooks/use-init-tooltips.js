import { Tooltip } from "bootstrap";
import { useEffect } from "react";

function useInitializeTooltips({
  animation = true,
  html = false,
  customClass = "",
  offset = [0, 0],
} = {}) {
  useEffect(() => {
    document
      .querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((tooltipTrigger) => {
        new Tooltip(tooltipTrigger, { animation, html, customClass, offset });
      });
  });
}

export default useInitializeTooltips;
