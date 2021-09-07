import { useContext } from "react";
import ThemeManager from "../../../../services/providers/theme";
import Themes from "../../../../themes";

function Spinner(props) {
  const [theme] = useContext(ThemeManager);
  const currentTheme = Themes[theme];

  return (
    <span
      className="w-100 h-100 d-flex align-items-center justify-content-center text-center"
      style={currentTheme}
    >
      <span
        className={
          "spinner-border fade " +
          props.addClass +
          (props.show ? " show visible ms-2" : " d-none invisible")
        }
        role="status"
        aria-hidden={props.ariaset?.hidden || false}
      ></span>

      {/* Text */}
      <span className={"pe-2 " + (props.children === undefined ? "" : "ps-2")}>
        {props?.show ? "" : props.children}
      </span>
    </span>
  );
}

export default Spinner;
