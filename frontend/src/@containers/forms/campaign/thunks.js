import {sendMessage} from "../../messages/thunks";

export const saveCampaign = form => {
  return dispatch => {
    try {
      if (form.id) {
        dispatch(updateCampaign(form));
      } else {
        dispatch(createCampaign(form));
      }
    } catch (e) {
      sendMessage(e.message, true);
    }
  }
};

export const updateCampaign = form => {
  return dispatch => {
  }
};

export const createCampaign = form => {
  return dispatch => {
  }
};
