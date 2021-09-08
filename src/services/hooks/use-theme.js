import { useState } from "react";
import { Constants } from "../../constants";

function useTheme() {
  const [theme, setTheme] = useState(Constants.DEFAULT_THEME);

  const changeTheme = (theme) =>
    setTheme(
      theme === Constants.DEFAULT_THEME
        ? Constants.THEME_DARK
        : Constants.THEME_LIGHT
    );

  return { theme, changeTheme };
}

export default useTheme;
