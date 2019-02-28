import { sendMessage } from '../../messages/thunks';
import {api} from "../../../@services";
import * as actions from './actions';
import { fetchCampaigns } from "../../campaigns/thunks";

export const saveCampaign = form => (dispatch) => {
  try {
    if (form.id) {
      dispatch(updateCampaign(form));
    } else {
      dispatch(createCampaign(form));
    }
  } catch (e) {
    sendMessage(e.message, true);
  }
};

export const updateCampaign = form => (dispatch) => {
};

export const createCampaign = form => async dispatch => {
  console.log(form);
  try {
    if (!form.companyId) {
      throw new Error('Missing required company!');
    }

    if (!form.dealId) {
      throw new Error('Missing required deal!');
    }
    await api.post(
      `/v1/agency/companies/${form.companyId}/deals/${form.dealId}/campaigns`,
      form
    );
    await dispatch(actions.savedCampaign());
    await dispatch(fetchCampaigns());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
