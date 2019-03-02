import {
  GOTO_PAGE_LEADS, LOAD_LEADS, OPEN_LEAD_MODAL, SEARCH_LEADS, SHOW_DELETE_LEADS, SORT_LEADS,
} from './actions';
import { LeadStatuses } from "@models/lead-statuses";

const initState = {
  leads: [],
  pagination: {
    current_page: 1,
    per_page: 10,
    last_page: 1,
  },
  openModalStatus: false,
  statuses: LeadStatuses,
  query: {
    search: '',
    showDeleted: false,
    filters: {
      statusId: '',
    },
    sort: {
      status: true,
      agents: null,
      company: null,
      campaign: null,
      email: null,
    },
  },
};
const leads = (state = initState, action) => {
  switch (action.type) {
    case LOAD_LEADS: {
      return {
        ...state,
        leads: [...action.leads],
        pagination: action.pagination,
      };
    }
    case GOTO_PAGE_LEADS: {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          current_page: action.activePage,
        },
      };
    }
    case SEARCH_LEADS: {
      return {
        ...state,
        query: {
          ...state.query,
          search: action.search,
        },
      };
    }
    case SHOW_DELETE_LEADS: {
      return {
        ...state,
        query: {
          ...state.query,
          showDeleted: !state.query.showDeleted,
        },
      };
    }
    case SORT_LEADS: {
      return {
        ...state,
        query: {
          ...state.query,
          sort: {
            ...state.query.sort,
            [action.field]: (state.query.sort[action.field] === false ? null : !state.query.sort[action.field]),
          },
        },
      };
    }
    case OPEN_LEAD_MODAL: {
      return {
        ...state,
        openModalStatus: action.status,
      };
    }
    default: {
      return state;
    }
  }
};

export default leads;
