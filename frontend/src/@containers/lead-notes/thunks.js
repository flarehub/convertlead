import {sendMessage} from "../messages/thunks";
import {api} from "../../@services";
import * as actions from './actions';
import {addBreadCrumb} from "../breadcrumb/actions";

export const loadLead = (companyId, leadId) => async dispatch => {
  try {
    const response = await api.get(`/v1/agency/companies/${companyId}/leads/${leadId}`);
    const { data } = response;
    await dispatch(actions.loadLead(data));
    await dispatch(addBreadCrumb({
      name: data.fullname || data.email || data.phone,
      path: '/'
    }, false))
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const createLeadNote = form => async (dispatch, getState) => {
  try {
    const { lead } = getState().leadNotes;
    await api.post(`/v1/agency/companies/${lead.company_id}/leads/${lead.id}/notes`, form);
    await dispatch(sendMessage('Successfully added'));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
