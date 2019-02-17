import { sendMessage } from '../../messages/thunks';


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

export const updateAgent = form => (dispatch) => {
};

export const createAgent = form => (dispatch) => {
};
