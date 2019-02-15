import {
  LOAD_LEAD,
  SAVED_LEAD,
} from "./actions";

const initState = {
  title: null,
  show: false,
  id: null,
  campaignId: null,
  companyId: null,
  agentId: null,
  fullname: null,
  email: null,
  phone: null,
};

const leadForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_LEAD: {
      return {
        ...state,
        ...action.form,
        title: !action.form.id ? 'Create Lead' : 'Edit lead',
        show: true,
      }
    }
    case SAVED_LEAD: {
      return {
        ...state,
        ...action.form,
        show: false,
      }
    }
    default: {
      return state;
    }
  }
};

export default leadForm;