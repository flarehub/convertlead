import api from "../../@services/api";
import { updateUserProfile } from "./actions";


export const getUserProfile = () => {
  return async (dispatch) => {
    const { data } = await api.get('/v1/profile');
    await dispatch(updateUserProfile(data));
  };
};