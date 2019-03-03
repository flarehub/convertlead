import {
  ADD_COMPANIES, ADD_SELECT_BOX_COMPANIES, LOAD_COMPANY, OPEN_COMPANY_MODAL, SORT_COMPANIES,
  TOGGLE_SHOW_DELETED,
} from './actions';

const initState = {
  company: {},
  companies: [],
  selectBoxCompanies: [],
  pagination: {
    current_page: 1,
    per_page: 10,
    last_page: 1,
  },
  openModal: false,
  query: {
    search: '',
    showDeleted: false,
    sort: {
      name: true,
      deals: null,
      leads: null,
      agents: null,
      avg_response: null,
    },
  },
};

const companies = (state = initState, action) => {
  switch (action.type) {
    case ADD_COMPANIES: {
      return {
        ...state,
        companies: [...action.companies],
        pagination: action.pagination,
        query: {
          ...state.query,
          search: (action.search ? action.search : ''),
        },
      };
    }
    case SORT_COMPANIES: {
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
    case OPEN_COMPANY_MODAL: {
      return {
        ...state,
        openModal: action.open,
      };
    }
    case TOGGLE_SHOW_DELETED: {
      return {
        ...state,
        query: {
          ...state.query,
          showDeleted: !state.query.showDeleted,
        },
      };
    }
    case ADD_SELECT_BOX_COMPANIES: {
      return {
        ...state,
        selectBoxCompanies: [...action.companies],
      };
    }
    case LOAD_COMPANY: {
      return {
        ...state,
        company: action.company
      }
    }
    default: {
      return state;
    }
  }
};

export default companies;
