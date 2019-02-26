import { LOAD_CAMPAIGN, SAVED_CAMPAIGN } from './actions';
import {CHANGE_COMPANY} from "../company/actions";

const initState = {
  form: {
    show: false,
    dealId: '',
    companyId: '',
    name: '',
    integrationType: '',
  },
  required: {
    name: true,
  }
};

const campaignForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_CAMPAIGN: {
      return {
        ...state,
        ...action.form,
        title: !action.form.id ? 'Create Campaign' : 'Edit Campaign',
        show: true,
      };
    }
    case CHANGE_COMPANY: {
      return {
        ...state,
        form: {
          ...state.form,
          ...action.form,
        },
      };
    }
    case SAVED_CAMPAIGN: {
      return {
        ...state,
        form: {
          ...state.form,
          show: false
        }
      };
    }
    default: {
      return state;
    }
  }
};

export default campaignForm;
