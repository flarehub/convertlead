import {
  CHANGE_AGENT,
  LOAD_AGENT, SAVED_AGENT,
} from './actions';

const initState = {
  form: {
    show: false,
    title: '',
    id: '',
    company_id: '',
    newCompanyId: '',
    avatar: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  },
  required: {
    avatar: true,
    name: true,
    email: true,
  }
};

const agentForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_AGENT: {
      return {
        ...state,
        form: {
          ...action.form,
          title: !action.form.id ? 'Create Agent' : 'Edit Agent',
        }
      };
    }
    case CHANGE_AGENT: {
      return {
        ...state,
        form: {
          ...state.form,
          ...action.form
        }
      }
    }
    case SAVED_AGENT: {
      return {
        ...state,
        form: {
          ...state.form,
          ...action.form,
          show: false,
        }
      };
    }
    default: {
      return state;
    }
  }
};

export default agentForm;
