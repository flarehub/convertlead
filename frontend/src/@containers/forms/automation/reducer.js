import {
  CHANGE_AUTOMATION_ACTION,
  LOAD_AUTOMATION_ACTION,
  SAVED_AUTOMATION_ACTION
} from './actions';

import {DELAY_TYPE_TIME} from "./delayTypes";
import {TYPE_SMS_MESSAGE} from "./actionTypes";

const initState = {
  form: {
    show: false,
    title: '',
    id: '',
    type: TYPE_SMS_MESSAGE,
    lead_reply_type: '',
    is_root: false,
    object: '',
    delay_time: '',
    stop_on_manual_contact: false,
    delay_type: DELAY_TYPE_TIME,
  },
  required: {
    type: true,
    lead_reply_type: true,
    is_root: true,
    object: true,
    delay_time: true,
    delay_type: true,
  }
};

const agentForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_AUTOMATION_ACTION: {
      console.log(state.form, action.form);
      return {
        ...state,
        form: {
          ...action.form,
          title: !action.form.id ? 'Create Action' : 'Edit Action',
        }
      };
    }
    case CHANGE_AUTOMATION_ACTION: {
      return {
        ...state,
        form: {
          ...state.form,
          ...action.form
        }
      }
    }
    case SAVED_AUTOMATION_ACTION: {
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
