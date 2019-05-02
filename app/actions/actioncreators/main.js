import * as Main from "../actiontypes/main";
import * as CurrentUser from "../actiontypes/currentuser";
import * as CONST_API from "../../constants/api";
import Networking from "../../services/networking";
import I18n from "../../services/i18n";
import { MessageBarManager } from "react-native-message-bar";
import * as Session from "../../util/session";

import * as RouterName from "../../constants/routername";
import NavigationService from "../../services/navigationservice";
import * as Nav from "../actiontypes/nav";

const reducerTypeArray = {
    home: CONST_API.GET_TIMELINES_HOME,
    local: CONST_API.GET_TIMELINES_LOCAL,
    federal: CONST_API.GET_TIMELINES_FEDERAL,
    notifications: CONST_API.GET_NOTIFICATIONS
};

export function back() {
    NavigationService.back();
    return { type: Nav.NAV_GO_BACK };
}

export function toot() {
    NavigationService.navigate({ routeName: RouterName.Toot });
    return { type: Nav.NAV_TOOT };
}

export function reply(id, tootid, user, acct, image, body) {
    NavigationService.navigate({ routeName: RouterName.Toot, params: { id, tootid, user, acct, image, body } });
    return { type: Nav.NAV_TOOT_REPLY };
}

export function hide(id) {
    return { type: Main.HIDE_MASTOLIST, id: id };
}

export function deleting(id) {
    return async dispatch => {
        try {
            let { domain, access_token } = await Session.getDomainAndToken();
            await Networking.fetch(domain, CONST_API.DELETE_STATUS, id, {}, access_token);
            dispatch({ type: Main.HIDE_MASTOLIST, id: id });
            MessageBarManager.showAlert({
                title: I18n.t("messages.toot_deleted_success"),
                alertType: "success"
            });
        } catch (e) {
            MessageBarManager.showAlert({
                title: I18n.t("messages.toot_deleted_failed"),
                message: e.message,
                alertType: "error"
            });
        }
    };
}

export function detail(id) {
    NavigationService.navigate({ routeName: RouterName.Detail, params: { id } });
    return { type: Nav.NAV_DETAIL, id };
}

export function newLoadingTimeline(reducerType, since_id, limit = 40) {
    return async dispatch => {
        dispatch({ type: Main.REFRESHING_MASTOLIST, reducerType });
        let data;
        try {
            let { domain, access_token } = await Session.getDomainAndToken();
            data = await Networking.fetch(domain, reducerTypeArray[reducerType], null, { limit, since_id, max_id: null }, access_token);
            dispatch({ type: Main.NEW_UPDATE_MASTOLIST, data: data, reducerType });
        } catch (e) {
            MessageBarManager.showAlert({
                title: I18n.t("messages.network_error"),
                message: e.message,
                alertType: "error"
            });
            dispatch({ type: Main.STOP_REFRESHING_MASTOLIST, reducerType });
        }
    };
}

export function oldLoadingTimeline(reducerType, max_id, limit = 40) {
    return async dispatch => {
        dispatch({ type: Main.REFRESHING_MASTOLIST, reducerType });
        let data;
        try {
            let { domain, access_token } = await Session.getDomainAndToken();
            data = await Networking.fetch(domain, reducerTypeArray[reducerType], null, { limit, since_id: null, max_id }, access_token);
            dispatch({ type: Main.OLD_UPDATE_MASTOLIST, data: data, reducerType });
        } catch (e) {
            MessageBarManager.showAlert({
                title: I18n.t("messages.network_error"),
                message: e.message,
                alertType: "error"
            });
        }
    };
}

//未使用
export function getCurrentUser() {
    return async dispatch => {
        try {
            let { domain, access_token } = await Session.getDomainAndToken();
            let user_credentials = await Networking.fetch(domain, CONST_API.GET_CURRENT_USER, null, {}, access_token);
            let instance = await Networking.fetch(domain, CONST_API.GET_INSTANCE, null, {}, access_token);
            dispatch({ type: CurrentUser.UPDATE_CURRENT_USER, user_credentials, domain, access_token, instance });
        } catch (e) {
            MessageBarManager.showAlert({
                title: I18n.t("messages.network_error"),
                message: e.message,
                alertType: "error"
            });
        }
    };
}
