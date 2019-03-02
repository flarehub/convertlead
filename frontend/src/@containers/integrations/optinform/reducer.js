import {CHANGE_FIELD_INTEGRATION, LOAD_CAMPAIGN_INTEGRATION, RESET_FORM} from "./actions";

const initState = {
  campaign: {
    uuid: '',
    integration_config: {
      header: {
        title: ''
      },
      fullname: {
        name: 'fullname',
        label: '',
        placeholder: '',
        value: '',
        isRequired: false,
        isVisible: false,
      },
      phone: {
        name: 'phone',
        label: '',
        placeholder: '',
        value: '',
        isRequired: false,
        isVisible: false,
      },
      email: {
        name: 'email',
        label: '',
        placeholder: '',
        value: '',
        isRequired: false,
        isVisible: false,
      },
      button: {
        name: 'Subscribe',
      }
    }
  },
  form: {
    show: false,
    showResend: false,
    fullname:  '',
    phone: '',
    email: '',
  }
};

const optionForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_CAMPAIGN_INTEGRATION: {
      let integration;
      integration = JSON.parse(action.campaign.integration_config);
      return {
        ...state,
        campaign: {
          ...state.campaign,
          ...action.campaign,
          integration_config: integration,
        },
        form: {
          ...state.form,
          show: true,
        }
      }
    }
    case CHANGE_FIELD_INTEGRATION: {
      return {
        ...state,
        form: {
          ...state.form,
          ...action.field,
        }
      }
    }
    case RESET_FORM: {
      return {
        ...state,
        form: {
          fullname: '',
          email: '',
          phone: '',
          ...action.form,
        }
      }
    }
    default: {
      return state;
    }
  }
};

export default optionForm;
