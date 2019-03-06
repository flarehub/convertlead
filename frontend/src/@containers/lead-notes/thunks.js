import {sendMessage} from "../messages/thunks";
import {api, Auth} from "@services";
import * as actions from './actions';
import {addBreadCrumb} from "../breadcrumb/actions";
import {hideLoader, showLoader} from "../loader/actions";

export const loadLead = (companyId, leadId, skip = false) => async dispatch => {
  try {
    await dispatch(showLoader());
    const response = await api.get(`/v1/${Auth.role}/companies/${companyId}/leads/${leadId}`);
    const { data } = response;
    await dispatch(actions.loadLead(data));
    if (!skip) {
      await dispatch(addBreadCrumb({
        name: data.fullname || data.email || data.phone,
        path: '/'
      }, false))
    }
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
  await dispatch(hideLoader());
};

export const createLeadNote = form => async (dispatch, getState) => {
  try {
    const { lead } = getState().leadNotes;
    await api.post(`/v1/${Auth.role}/companies/${lead.company.id}/leads/${lead.id}/notes`, form);
    dispatch(loadLead(lead.company.id, lead.id, true));
    await dispatch(sendMessage('Successfully added'));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};
