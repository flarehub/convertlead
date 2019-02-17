import { LOAD_CAMPAIGN, SAVED_CAMPAIGN } from './actions';

const initState = {
  show: false,
  title: null,
  dealId: null,
  companyId: null,
  name: null,
  description: null,
  integrationType: null,
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
    case SAVED_CAMPAIGN: {
      return {
        ...state,
        show: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default campaignForm;
