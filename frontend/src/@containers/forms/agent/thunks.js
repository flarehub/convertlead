import { sendMessage } from '../../messages/thunks';
import * as actions  from './actions';
import {api} from "../../../@services";
import {loadAgents} from "@containers/agents/thunks";


export const saveAgent = form => (dispatch) => {
  try {
    if (form.id) {
      dispatch(updateAgent(form));
    } else {
      dispatch(createAgent(form));
    }
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const updateAgent = form => {
  return async dispatch => {
    try {
      await api.patch(`/v1/agency/agents/${form.id}`, form);
      await dispatch(actions.savedAgent());
      await dispatch(loadAgents());
      dispatch(sendMessage('Successfully saved!'));
    } catch (e) {
      await dispatch(sendMessage(e.message, true));
    }
  }
};

export const createAgent = form => {
  return async dispatch => {
    try {
      await api.post(`/v1/agency/agents`, form);
      dispatch(sendMessage('Successfully saved!'));
      await dispatch(actions.savedAgent());
      await dispatch(loadAgents());
    } catch (e) {
      await dispatch(sendMessage(e.message, true));
    }
  }
};
