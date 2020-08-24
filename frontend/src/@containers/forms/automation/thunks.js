import { sendMessage } from '../../messages/thunks';
import * as actions  from './actions';
import {api, Auth} from "@services";
import {loadAgents} from "@containers/agents/thunks";


export const saveAutomationAction = form => (dispatch) => {
  try {
    if (form.id) {
      dispatch(updateAutomationAction(form));
    } else {
      dispatch(createAutomationAction(form));
    }
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const updateAutomationAction = form => {
  return async dispatch => {
    try {
      await api.patch(`/v1/company/deals/${form.deal_id}/actions/${form.id}`, form);
      await dispatch(actions.savedAutomationAction());
      await dispatch(loadAgents());
      dispatch(sendMessage('Action updated!'));
    } catch (e) {
      await dispatch(sendMessage(e.message, true));
    }
  }
};

export const createAutomationAction = form => {
  return async dispatch => {
    try {
      await api.post(`/v1/company/deals/${form.deal_id}/actions/${form.id}`, form);
      dispatch(sendMessage('Success! Credentials sent to agent email'));
      await dispatch(actions.savedAgent());
      await dispatch(loadAgents());
    } catch (e) {
      await dispatch(sendMessage(e.message, true));
    }
  }
};
