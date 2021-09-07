import { useState } from "react";
import { Constants } from "../../constants";

function useTheme() {
  const [theme, setTheme] = useState(Constants.DEFAULT_THEME);

  const changeTheme = (theme) => setTheme(theme);

  return { theme, changeTheme };
}

export default useTheme;
