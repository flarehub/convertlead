import {ADD_COMPANIES, OPEN_COMPANY_MODAL, SORT_COMPANIES} from './actions';

const initState = {
  companies: [],
  pagination: {
    current_page: 1,
    last_page: 1,
  },
  openModal: false,
  query: {
    search: '',
    sort: {
      name: true,
      deals: null,
      leads: null,
      agents: null,
      avg_response: null,
    }
  }
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
          search: action.search,
        }
      }
    }
    case SORT_COMPANIES: {
     return {
       ...state,
       query: {
         ...state.query,
         sort: {
           [action.field]: (state.query.sort[action.field] === false ? null : !state.query.sort[action.field])
         }
       }
     }
    }
    case OPEN_COMPANY_MODAL: {
      return {
        ...state,
        openModal: action.open
      }
    }
    default: {
      return state
    }
  }
};

export default companies;