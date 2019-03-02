import * as actions from './actions';
import {sendMessage} from "../../../messages/thunks";
import {api} from "@services";
import {fetchCampaigns} from "@containers/campaigns/thunks";

export const saveOptinForm = form => async dispatch => {

  try {
    if (!form.companyId) {
      throw new Error('Missing required company!');
    }

    if (!form.dealId) {
      throw new Error('Missing required deal!');
    }
    await api.patch(
      `/v1/agency/companies/${form.companyId}/deals/${form.dealId}/campaigns/${form.id}`,
      {
        integration_config: form.integrationForm
      }
    );
    await dispatch(actions.saveOptionForm());
    await dispatch(fetchCampaigns());
    await dispatch(sendMessage('Successfully saved!'));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
