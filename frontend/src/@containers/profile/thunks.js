import api from '../../@services/api';
import { updateUserProfile } from './actions';


export const getUserProfile = () => async (dispatch) => {
  const { data } = await api.get('/v1/profile');
  await dispatch(updateUserProfile(data));
};
