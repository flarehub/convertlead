import { sendMessage } from '../../messages/thunks';
import {api} from "../../../@services";
import * as actions from './actions';
import { fetchCampaigns } from "../../campaigns/thunks";
import optinFormIntegration from "../integrations/optinform/reducer";

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

export const updateCampaign = form => async (dispatch) => {
  try {
    if (!form.companyId) {
      throw new Error('Missing required company!');
    }

    if (!form.dealId) {
      throw new Error('Missing required deal!');
    }
    await api.patch(
      `/v1/agency/companies/${form.companyId}/deals/${form.dealId}/campaigns/${form.id}`,
      form
    );
    await dispatch(actions.savedCampaign());
    await dispatch(fetchCampaigns());
    await dispatch(sendMessage('Successfully saved!'));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const createCampaign = form => async (dispatch, getState) => {
  try {
    if (!form.companyId) {
      throw new Error('Missing required company!');
    }

    if (!form.dealId) {
      throw new Error('Missing required deal!');
    }

    const { integrationForm } = getState().forms.optinFormIntegration.form;
    await api.post(
      `/v1/agency/companies/${form.companyId}/deals/${form.dealId}/campaigns`,
      {
        ...form,
        integration_config: JSON.stringify(integrationForm),
      },
    );
    await dispatch(actions.savedCampaign());
    await dispatch(fetchCampaigns());
    await dispatch(sendMessage('Successfully saved!'));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
