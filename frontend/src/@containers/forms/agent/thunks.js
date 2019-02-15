import {sendMessage} from "../../messages/thunks";


export const saveAgent = form => {
  return dispatch => {
    try {
      if (form.id) {
        dispatch(updateAgent(form))
      } else {
        dispatch(createAgent(form))
      }
    } catch (e) {
      dispatch(sendMessage(e.message, true))
    }
  }
};

export const updateAgent = form => {
  return dispatch => {
  }
};

export const createAgent = form => {
  return dispatch => {
  }
};
