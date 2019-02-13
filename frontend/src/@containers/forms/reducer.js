import {
  LOAD_AGENT, LOAD_CAMPAIGN, LOAD_COMPANY, LOAD_DEAL, LOAD_LEAD, SAVED_AGENT, SAVED_CAMPAIGN, SAVED_COMPANY, SAVED_DEAL,
  SAVED_LEAD,
  SAVED_USER_PROFILE
} from "./actions";

const initState = {
  loginForm: {
    email: null,
    password: null,
  },
  profileForm: {
    title: null,
    name: null,
    email: null,
    phone: null,
    avatar: null,
    password: null,
    confirmation_password: null,
  },
  agentForm: {
    title: null,
    show: false,
    id: null,
    companyId: null,
    agencyId: null,
    avatar: null,
    name: null,
    email: null,
    password: null,
    confirmation_password: null,
  },
  companyForm: {
    title: null,
    show: false,
    id: null,
    name: null,
    email: null,
    phone: null,
    avatar: null,
    password: null,
    confirmation_password: null
  },
  dealForm: {
    title: null,
    id: null,
    companyId: null,
    name: null,
  },
  campaignForm: {
    title: null,
    dealId: null,
    companyId: null,
    name: null,
    description: null,
    integrationType: null,
  },
  leadForm: {
    title: null,
    show: false,
    id: null,
    campaignId: null,
    companyId: null,
    agentId: null,
    fullname: null,
    email: null,
    phone: null,
  }
};

const forms = (state = initState, action) => {
  switch (action.type) {
    case SAVED_USER_PROFILE: {
      return {
        ...state,
        profileForm: action.form
      }
    }
    case LOAD_AGENT: {
      return {
        ...state,
        agentForm: {
          ...action.form,
          show: true,
        },
      }
    }
    case SAVED_AGENT: {
      return {
        ...state,
        agentForm: {
          ...state.agentForm,
          show: false,
        }
      }
    }
    case LOAD_COMPANY: {
      return {
        ...state,
        companyForm: {
          ...state.form,
          show: true,
        },
      }
    }
    case SAVED_COMPANY: {
      return {
        ...state,
        companyForm: {
          ...state.form,
          show: false,
        },
      }
    }
    case LOAD_DEAL: {
      return {
        ...state,
        dealForm: {
          ...state.form,
          show: true,
        }
      }
    }
    case SAVED_DEAL: {
      return {
        ...state,
        dealForm: {
          ...state.form,
          show: false,
        }
      }
    }
    case LOAD_CAMPAIGN: {
      return {
        ...state,
        campaignForm: {
          ...state.form,
          show: true,
        }
      }
    }
    case SAVED_CAMPAIGN: {
      return {
        ...state,
        campaignForm: {
          ...state.form,
          show: false,
        }
      };
    }
    case LOAD_LEAD: {
      return {
        ...state,
        leadForm: {
          ...state.form,
          show: true,
        }
      }
    }
    case SAVED_LEAD: {
      return {
        ...state,
        leadForm: {
          ...state.form,
          show: false,
        }
      }
    }
    default: {
      return state;
    }
  }
};

export default forms;