import { sendMessage } from '../../messages/thunks';
import * as actions from './actions';
import {api, Auth} from '@services';
import { getCompanyDeals } from '../../deals/thunks';

export const saveDeal = form => (dispatch) => {
  try {
    if (form.id) {
      dispatch(updateDeal(form));
    } else {
      dispatch(createDeal(form));
    }
  } catch (e) {
    sendMessage(e.message, true);
  }
};

export const createDeal = form => async (dispatch) => {
  try {
    if (!form.companyId) {
      throw new Error('Missing required Company!');
    }
    await api.post(`/v1/${Auth.role}/companies/${form.companyId}/deals`, form);
    await dispatch(sendMessage('Successfully saved!'));
    await dispatch(actions.savedDeal());
    await dispatch(getCompanyDeals());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const updateDeal = form => async (dispatch) => {
  try {
    if (!form.companyId) {
      throw new Error('Missing required Company!');
    }

    await api.patch(`/v1/${Auth.role}/companies/${form.companyId}/deals/${form.id}`, form);
    await dispatch(sendMessage('Successfully saved!'));
    await dispatch(actions.savedDeal());
    await dispatch(getCompanyDeals());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
