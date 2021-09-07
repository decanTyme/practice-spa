import useTheme from "../../services/hooks/use-theme";
import { ThemeContext } from "../../services/providers/theme";

function ThemeProvider({ children }) {
  const theme = useTheme();
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export default ThemeProvider;
