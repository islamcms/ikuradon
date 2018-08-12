import * as Config from "../actiontypes/config";
import * as Permission from "../../util/permission";
import { ImagePicker } from "expo";
import * as Nav from "../actiontypes/nav";

export function setBackground() {
    return async dispatch => {
        try {
            await Permission.getBeforeAsk(Permission.CAMERA_ROLL);
            let fileData = await ImagePicker.launchImageLibraryAsync();
            if (!fileData || !fileData.uri || fileData.cancelled) {
                return;
            }
            dispatch({ type: Config.SET_BACKGROUNDIMAGE, backgroundImage:fileData.uri });
            dispatch({ type: Nav.NAV_MAIN });
        } catch (e) {
            MessageBarManager.showAlert({
                title: I18n.t("messages.network_error"),
                message: e.message,
                alertType: "error",
            });
        }
    };
}