import Themes from "../../../../../../themes";
import useThemeProvider from "../../../../../../services/providers/theme";
import ModalMenu from "../../../../common/menus/ModalMenu";
import { Constants } from "../../../../../../constants";

function SettingsMenu() {
  const { theme, changeTheme } = useThemeProvider();

  const onThemeModeChecked = () => {
    changeTheme(
      theme === Constants.THEME_LIGHT
        ? Constants.THEME_LIGHT
        : Constants.THEME_DARK
    );
  };

  return (
    <ModalMenu
      id="settingsMenu"
      fade={true}
      centered={true}
      title="Settings"
      themeMode={Themes[theme]}
      body={
        <div>
          Theme
          <div className="form-check form-switch">
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
            >
              {theme} Mode
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              onClick={onThemeModeChecked}
            />
          </div>
        </div>
      }
      dismissBtn={
        <button
          type="button"
          className="btn btn-primary"
          data-bs-dismiss="modal"
        >
          Save changes
        </button>
      }
    />
  );
}

export default SettingsMenu;
