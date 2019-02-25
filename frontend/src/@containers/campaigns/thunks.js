import {api} from "../../@services";
import {sendMessage} from "../messages/thunks";
import * as actions from './actions';
import {hideLoader, showLoader} from "../loader/actions";

export const fetchCampaigns = () => async (dispatch, getState) => {
  try {
    await dispatch(showLoader());
    const { pagination, companyId, dealId } = getState().campaigns;
    const response = await api.get(`/v1/agency/companies/${companyId}/deals/${dealId}/campaigns`);
    const { data, ...rest } = response.data;
    await dispatch(actions.loadCampaigns(data, rest));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }

  await dispatch(hideLoader());
};

export const loadCampaigns = (companyId, dealId) => async dispatch => {
  try {
    await dispatch(actions.fetchCampaigns(companyId, dealId));
    await dispatch(fetchCampaigns());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const toggleShowDeletedCampaigns = () => async dispatch => {
  await dispatch(actions.toggleShowDeletedCampaigns());
};

export const gotoPage = page => async dispatch =>  {
  await dispatch(actions.gotoPageCampaigns(page));
};

export const sortCampaigns = field => async dispatch =>  {
  await dispatch(actions.sortCampaigns(field));
};
