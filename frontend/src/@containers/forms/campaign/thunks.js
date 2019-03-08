import * as actions from './actions';
import { fetchCampaigns } from "@containers/campaigns/thunks";
import { sendMessage } from '@containers/messages/thunks';
import { Auth } from "@services";
import {IntegrationForm} from "@models/optin-form";
import {createAgencyCompanyCampaign, createCompanyCampaign, updateAgencyCompanyCampaign, updateCompanyCampaign} from "./api";

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
    if (!form.companyId && Auth.isAgency) {
      throw new Error('Missing required company!');
    }

    if (!form.dealId) {
      throw new Error('Missing required deal!');
    }
    await (Auth.isAgency
      ? updateAgencyCompanyCampaign(form)
      : updateCompanyCampaign(form));

    await dispatch(actions.savedCampaign());
    await dispatch(fetchCampaigns());
    await dispatch(sendMessage('Successfully saved!'));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const createCampaign = form => async (dispatch, getState) => {
  try {
    if (!form.companyId && Auth.isAgency) {
      throw new Error('Missing required company!');
    }

    if (!form.dealId) {
      throw new Error('Missing required deal!');
    }
    const formData = {
      ...form,
      integration_config: JSON.stringify(IntegrationForm),
    };

    await (Auth.isAgency
      ? createAgencyCompanyCampaign(formData)
      : createCompanyCampaign(formData));

    await dispatch(actions.savedCampaign());
    await dispatch(fetchCampaigns());
    await dispatch(sendMessage('Successfully saved!'));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
