import { useState } from "react";
import { ThemeContext } from "../../../services/providers/theme";
import Constants from "../../state/slices/constants";

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(Constants.DEFAULT_THEME);

  const changeTheme = (theme) =>
    setTheme(
      theme === Constants.DEFAULT_THEME
        ? Constants.THEME_DARK
        : Constants.THEME_LIGHT
    );

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
