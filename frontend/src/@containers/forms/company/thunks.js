import {sendMessage} from "../../messages/thunks";

export const saveUserProfile = form => {
  return dispatch => {
    try {
    } catch (e) {
      sendMessage(e.message, true)
    }
  }
};

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

export const saveCompany = form => {
  return dispatch => {
    try {
      if (form.id) {
        dispatch(updateCompany(form));
      } else  {
        dispatch(createCompany(form));
      }
    } catch (e) {
      sendMessage(e.message, true);
    }
  }
};

export const createCompany = form => {
  return dispatch => {
  }
};

export const updateCompany = form => {
  return dispatch => {
  }
};

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
  return dispatch => {
  }
};

export const createLead = form => {
  return dispatch => {
  }
};
