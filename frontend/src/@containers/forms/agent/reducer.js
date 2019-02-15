import {
  LOAD_AGENT, SAVED_AGENT
} from "./actions";

const initState = {
  show: false,
  title: null,
  id: null,
  companyId: null,
  agencyId: null,
  avatar: null,
  name: null,
  email: null,
  password: null,
  confirmation_password: null,
};

const agentForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_AGENT: {
      return {
        ...state,
        ...action.form,
        title: !action.form.id ? 'Create Agent' : 'Edit Agent',
        show: true,
      }
    }
    case SAVED_AGENT: {
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

export default agentForm;