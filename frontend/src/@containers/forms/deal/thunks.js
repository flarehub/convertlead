import {sendMessage} from "../../messages/thunks";

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
  return dispatch => {
  };
};

export const updateDeal = form => {
  return dispatch => {
  };
};
