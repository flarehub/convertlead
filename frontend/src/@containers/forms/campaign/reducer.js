import {CHANGE_CAMPAIGN, LOAD_CAMPAIGN, SAVED_CAMPAIGN} from './actions';

const initState = {
  form: {
    show: false,
    dealId: '',
    companyId: '',
    name: '',
    integration: '',
    agents: [],
  },
  integrationTypes: [
    { key: 'FACEBOOK', value: 'FACEBOOK', text: 'Facebook' },
    { key: 'ZAPIER', value: 'ZAPIER', text: 'Zapier' },
    { key: 'OPTIN_FORM', value: 'OPTIN_FORM', text: 'Optin Form' },
  ],
  required: {
    name: true,
    integration: true,
    agents: true,
  }
};

const campaignForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_CAMPAIGN: {
      return {
        ...state,
        form: {
          ...action.form,
          title: !action.form.id ? 'Create Campaign' : 'Edit Campaign',
          show: true,
        },
      };
    }
    case CHANGE_CAMPAIGN: {
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
