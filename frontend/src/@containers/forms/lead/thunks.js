import {sendMessage} from "../../messages/thunks";

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
  }
};

export const createLead = form => {
  return async dispatch => {

  }
};
