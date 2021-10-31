import { Tooltip } from "bootstrap";
import { useEffect } from "react";

function useInitializeTooltips({
  animation = true,
  html = false,
  customClass = "",
  offset = [0, 0],
  trigger = "hover focus",
  template = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
} = {}) {
  useEffect(() => {
    const tooltipList = [
      ...document.querySelectorAll(`[data-bs-toggle="tooltip"]`),
    ].map(
      (tooltipTriggerElement) =>
        new Tooltip(tooltipTriggerElement, {
          animation,
          html,
          customClass,
          offset,
          trigger,
          template,
        })
    );

    // Dispose all initialized tooltips on component unmount to prevent a
    // "ghost" tooltip that persists even on re-renders. These bugged
    // tooltips can only be removed via full page reloads.
    //
    // However, disposing the tooltips sometimes cause the error:
    //! Uncaught TypeError: Cannot read properties of null (reading 'template')
    //
    // Hence, more info is needed for a complete fix.
    return () =>
      tooltipList.forEach((tooltip) => {
        try {
          tooltip._config && tooltip.dispose();
        } catch (error) {
          // Log so more information
          // on the bug is noted
          console.log(error, tooltip);
        }
      });
  });
}

export default useInitializeTooltips;
