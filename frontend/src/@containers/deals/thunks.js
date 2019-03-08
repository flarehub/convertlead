import { Auth } from '../../@services';
import { addCompanyDeals } from './actions';
import { hideLoader, showLoader } from '../loader/actions';
import { sendMessage } from '../messages/thunks';
import { deleteAgencyCompanyDeal,
  deleteCompanyDeal,
  fetchAgencyCompanyDeals,
  fetchCompanyDeals } from "./api";

export const getCompanyDeals = (currentPage = 1, perPage = 10000) => async dispatch => {
  try {
    dispatch(showLoader());
    const params = { per_page: perPage, current_page: currentPage };
    const { data } = await (
      Auth.isAgency
        ? fetchAgencyCompanyDeals(params)
        : fetchCompanyDeals(params));

    await dispatch(addCompanyDeals(data.data));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
  dispatch(hideLoader());
};

export const deleteDeal = (companyId, id) => async (dispatch) => {
  try {
    await (Auth.isAgency
      ? deleteAgencyCompanyDeal(companyId, id)
      : deleteCompanyDeal(id));

    await dispatch(getCompanyDeals());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
