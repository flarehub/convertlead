import * as actions from './actions';
import {api, Auth} from "../../@services";
import {hideLoader, showLoader} from "../loader/actions";
import {sendMessage} from "../messages/thunks";
import {fetchAgencyDealCampaigns, fetchCompanyDealCampaigns} from "./api";

export const fetchCampaigns = () => async (dispatch, getState) => {
  try {
    await dispatch(showLoader());
    const { pagination, companyId, dealId, query } = getState().campaigns;
    let response;
    if (Auth.isAgency) {
      response = await fetchAgencyDealCampaigns(companyId, dealId, {
        current_page: pagination.current_page,
        per_page: pagination.per_page,
        showDeleted: (query.showDeleted ? query.showDeleted : null),
        ...query.sort,
      });
    } else {
      response = await fetchCompanyDealCampaigns(dealId, {
        current_page: pagination.current_page,
        per_page: pagination.per_page,
        showDeleted: (query.showDeleted ? query.showDeleted : null),
        ...query.sort,
      });
    }

    const { data, ...rest } = response.data;
    await dispatch(actions.loadDealCampaigns(data, rest));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }

  await dispatch(hideLoader());
};

export const loadDealCampaigns = (companyId, dealId) => async (dispatch, getState) => {
  try {
    await dispatch(actions.fetchCampaigns(companyId, dealId));
    await dispatch(fetchCampaigns());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const toggleShowDeletedCampaigns = () => async dispatch => {
  await dispatch(actions.toggleShowDeletedCampaigns());
  await dispatch(fetchCampaigns());
};

export const gotoPage = page => async dispatch =>  {
  await dispatch(actions.gotoPageCampaigns(page));
  await dispatch(fetchCampaigns());
};

export const sortCampaigns = field => async dispatch =>  {
  await dispatch(actions.sortCampaigns(field));
  await dispatch(fetchCampaigns());
};

export const deleteCampaign = (companyId, dealId, campaignId) => async dispatch =>  {
  try {
    await api.delete(`/v1/${Auth.role}/companies/${companyId}/deals/${dealId}/campaigns/${campaignId}`);
    await dispatch(fetchCampaigns());
  } catch (e) {
    dispatch(sendMessage(e.message, true))
  }
};
