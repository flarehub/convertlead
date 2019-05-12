import {api} from '../../services';
import {Platform} from "react-native";

export const registerDeviceToken = () => async (dispatch, getState) => {
    try {
        const {deviceToken} = getState().auth.session;
        const type = Platform.OS === "ios" ? "IOS" : "ANDROID";
        const {data} = await api.post('/devices', {
            device_token: deviceToken,
            type
        });

    } catch (error) {
        console.log("======>: register device Token error")
        // await dispatch(sendMessage(error.message, true));
    }
};

