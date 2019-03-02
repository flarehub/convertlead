import {CHANGE_OPTION_FORM_FIELD, LOAD_OPTIN_FORM, SAVE_OPTIN_FORM} from "./actions";

const initState = {
  form: {
    title: 'Integration OptIn Form',
    show: false,
    id: '',
    dealId: '',
    campaignId: '',
    uuid: '',
    integrationForm: {
      header: {
        title: 'Only Subscribe'
      },
      fullname: {
        order: 1,
        label: 'Full name',
        placeholder: 'Full name',
        value: '',
        isRequired: true,
        isVisible: true,
      },
      email: {
        order: 2,
        label: 'E-mail',
        placeholder: 'E-mail',
        value: '',
        isRequired: true,
        isVisible: true,
      },
      phone: {
        order: 3,
        label: 'Phone',
        placeholder: 'Phone',
        value: '',
        isRequired: true,
        isVisible: true,
      },
      button: {
        name: 'Subscribe',
      }
    }
  }
};

const optionForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_OPTIN_FORM: {
      let integration = {};
      if (action.form.integration_config) {
        integration = JSON.parse(action.form.integration_config);
      }
      console.log('optin-form', integration);
      return {
        ...state,
        form: {
          ...state.form,
          ...action.form,
          integrationForm: {
            ...state.form.integrationForm,
            ...integration,
          }
        }
      }
    }
    case CHANGE_OPTION_FORM_FIELD: {
      return {
        ...state,
        form: {
          ...state.form,
          integrationForm: {
            ...state.form.integrationForm,
            [action.field]: {
              ...state.form.integrationForm[action.field],
              ...action.fieldData,
            }
          }
        }
      }
    }
    case SAVE_OPTIN_FORM: {
      return {
        ...state,
        form: {
          ...state.form,
          ...action.form,
          show: false,
        }
      }
    }
    default: {
      return state;
    }
  }
};

export default optionForm;
