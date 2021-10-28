import Themes from "../../../../../../../themes";
import useThemeProvider from "../../../../../../../services/providers/theme";
import ModalMenu from "../../../../../common/ModalMenu";
import { Constants } from "../../../../../../../constants";

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
      fade
      _static
      keyboard
      themeMode={Themes[theme]}
    >
      <ModalMenu.Dialog>
        <ModalMenu.Content>
          <ModalMenu.Header>
            <ModalMenu.Title>Settings</ModalMenu.Title>
          </ModalMenu.Header>
          <ModalMenu.Body>
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
          </ModalMenu.Body>
          <ModalMenu.Footer>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
          </ModalMenu.Footer>
        </ModalMenu.Content>
      </ModalMenu.Dialog>
    </ModalMenu>
  );
}

export default SettingsMenu;
