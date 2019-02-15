import {sendMessage} from "../../messages/thunks";
import * as actions from './actions';
import { api } from "../../../@services";
import {getCompanyDeals} from "../../deals/thunks";

export const saveDeal = form => {
  return dispatch => {
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
};

export const createDeal = form => {
  return async dispatch => {
    try {
      await api.post(`/v1/agency/companies/${form.companyId}/deals`, form);
      dispatch(sendMessage('Successfully saved!'));
      dispatch(actions.savedDeal());
      dispatch(getCompanyDeals())
    } catch (e) {
      sendMessage(e.message, true)
    }
  };
};

export const updateDeal = form => {
  return async dispatch => {
    try {
      await api.patch(`/v1/agency/companies/${form.companyId}/deals/${form.id}`, form);
      dispatch(sendMessage('Successfully saved!'));
      dispatch(actions.savedDeal());
      dispatch(getCompanyDeals())
    } catch (e) {
      sendMessage(e.message, true)
    }
  };
};
