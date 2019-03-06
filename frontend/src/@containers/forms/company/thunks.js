import { sendMessage } from '../../messages/thunks';
import {api, Auth} from '@services';
import * as actions from './actions';
import { loadCompanies } from '../../companies/thunks';

export const saveCompany = form => (dispatch) => {
  try {
    if (form.id) {
      dispatch(updateCompany(form));
    } else {
      dispatch(createCompany(form));
    }
  } catch (e) {
    sendMessage(e.message, true);
  }
};

export const createCompany = form => async (dispatch) => {
  try {
    await api.post(`/v1/${Auth.role}/companies`, form);
    dispatch(sendMessage('Successfully saved'));
    dispatch(actions.savedCompany());
    await dispatch(loadCompanies());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const updateCompany = form => async (dispatch) => {
  try {
    await api.patch(`/v1/${Auth.role}/companies/${form.id}`, form);
    dispatch(sendMessage('Successfully saved'));
    dispatch(actions.savedCompany());
    await dispatch(loadCompanies());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
