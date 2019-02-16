import {sendMessage} from "../../messages/thunks";
import {api} from "../../../@services";
import * as actions from './actions';
import {loadLeads} from "../../leads/thunks";

export const saveLead = form => {
  return disptach => {
    try {
      if (form.id) {
        disptach(updateLead(form));
      } else {
        disptach(createLead(form));
      }
    } catch (e) {
      sendMessage(e.message, true)
    }
  }
};

export const updateLead = form => {
  return async dispatch => {
   try {
     await api.patch(`/v1/agency/companies/${form.company_id}/leads/${form.id}`, form);
     await dispatch(loadLeads());
     await dispatch(actions.savedLead());
     dispatch(sendMessage('Successfully saved!'))
   } catch (e) {
     dispatch(sendMessage(e.message, true))
   }
  }
};

export const createLead = form => {
  return async dispatch => {
    try {
      await api.post(`/v1/agency/companies/${form.company_id}/leads`, form);
      await dispatch(actions.savedLead());
      await dispatch(loadLeads());
    } catch (e) {
      dispatch(sendMessage(e.message, true));
    }
  }
};
