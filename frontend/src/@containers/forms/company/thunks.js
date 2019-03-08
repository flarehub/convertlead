import { sendMessage } from '../../messages/thunks';
import * as actions from './actions';
import { loadCompanies } from '../../companies/thunks';
import {createAgencyCompany, updateAgencyCompany} from "./api";

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
    await createAgencyCompany(form);
    dispatch(sendMessage('Successfully saved'));
    dispatch(actions.savedCompany());
    await dispatch(loadCompanies());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const updateCompany = form => async (dispatch) => {
  try {
    await updateAgencyCompany(form);
    dispatch(sendMessage('Successfully saved'));
    dispatch(actions.savedCompany());
    await dispatch(loadCompanies());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
