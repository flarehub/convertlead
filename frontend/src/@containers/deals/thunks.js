import { api } from '../../@services';
import { addCompanyDeals } from './actions';
import { hideLoader, showLoader } from '../loader/actions';
import { sendMessage } from '../messages/thunks';

export const getCompanyDeals = (currentPage = 1, perPage = 2000) => async (dispatch, getState) => {
  try {
    dispatch(showLoader());
    const { data } = await api.get('/v1/agency/deals', { params: { per_page: perPage, current_page: currentPage } });
    await dispatch(addCompanyDeals(data.data));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
  dispatch(hideLoader());
};

export const deleteDeal = (companyId, id) => async (dispatch) => {
  try {
    await api.delete(`/v1/agency/companies/${companyId}/deals/${id}`);
    await dispatch(getCompanyDeals());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
