import {LOAD_LEADS, OPEN_LEAD_MODAL} from "./actions";

const initState = {
  leads: [],
  pagination: {
    current_page: 1,
    per_page: 10,
    last_page: 1,
  },
  openModalStatus: false,
  query: {
    search: '',
    showDeleted: false,
    filters: {
      statusId: null,
    },
    sort: {
      status: true,
      agents: null,
      company: null,
      campaign: null,
      email: null,
    }
  }
};
const leads = (state = initState, action) => {
  switch (action.type) {
    case LOAD_LEADS: {
      return {
        ...state,
        leads: [...action.leads],
        pagination: action.pagination,
      }
    }
    case OPEN_LEAD_MODAL: {
      return {
        ...state,
        openModalStatus: action.status,
      }
    }
    default: {
      return state;
    }
  }
};

export default leads;