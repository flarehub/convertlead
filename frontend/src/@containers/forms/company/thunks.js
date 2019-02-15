import {sendMessage} from "../../messages/thunks";
import {api} from "../../../@services";
import * as actions from './actions';

export const saveCompany = form => {
  return dispatch => {
    try {
      if (form.id) {
        dispatch(updateCompany(form));
      } else  {
        dispatch(createCompany(form));
      }
    } catch (e) {
      sendMessage(e.message, true);
    }
  }
};

export const createCompany = form => {
  return async dispatch => {
    try {
      await api.post('/v1/agency/companies', form);
      dispatch(sendMessage('Successfully saved'));
      dispatch(actions.savedCompany())
    } catch (e) {
      dispatch(sendMessage(e.message, true));
    }
  }
};

export const updateCompany = form => {
  return dispatch => {
  }
};
