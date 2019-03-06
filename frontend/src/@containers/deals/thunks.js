import { api, Auth } from '../../@services';
import { addCompanyDeals } from './actions';
import { hideLoader, showLoader } from '../loader/actions';
import { sendMessage } from '../messages/thunks';

export const getCompanyDeals = (currentPage = 1, perPage = 10000) => async (dispatch, getState) => {
  try {
    dispatch(showLoader());
    const { data } = await api.get(`/v1/${Auth.role}/deals`, { params: { per_page: perPage, current_page: currentPage } });
    await dispatch(addCompanyDeals(data.data));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
  dispatch(hideLoader());
};

export const deleteDeal = (companyId, id) => async (dispatch) => {
  try {
    await api.delete(`/v1/${Auth.role}/companies/${companyId}/deals/${id}`);
    await dispatch(getCompanyDeals());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
