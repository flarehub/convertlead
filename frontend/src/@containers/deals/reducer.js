import {
  ADD_COMPANY_DEALS, CREATE_COMPANY_DEAL, DELETE_COMPANY_DEAL, FILTER_DEALS_BY_COMPANY, SEARCH_DEALS_BY_COMPANY,
  UPDATE_COMPANY_DEAL
} from "./actions";

const initState = {
  deals: [],
  filters: {
    search: null,
    companyId: null
  }
};

function deals(state = initState, action) {
  switch (action.type) {
    case ADD_COMPANY_DEALS: {
     return {
       ...state,
       deals: [ ...action.deals ]
     }
    }
    case CREATE_COMPANY_DEAL: {
      state.deals.push(action.deal);
      return {
        ...state,
      }
    }
    case UPDATE_COMPANY_DEAL: {
      state.deals.map(deal => {
        return (deal.id === action.deal.id ? { ...deal, ...action.deal } : deal);
      });
      return {
        ...state,
      }
    }
    case FILTER_DEALS_BY_COMPANY: {
      return {
        ...state,
        filters: {
          ...state.filters,
          companyId: action.id
        }
      }
    }
    case SEARCH_DEALS_BY_COMPANY: {
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.search
        }
      }
    }
    default: {
      return state;
    }
  }
}

export default deals;