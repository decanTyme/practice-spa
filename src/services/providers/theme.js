import { createContext, useContext } from "react";

export const ThemeContext = createContext();

function useThemeProvider() {
  return useContext(ThemeContext);
}

export default useThemeProvider;
