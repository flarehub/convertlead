import {FETCH_CAMPAIGNS, GOTO_PAGE_CAMPAIGN, LOAD_CAMPAIGNS, SHOW_DELETED_CAMPAIGNS} from "./actions";

const initState = {
  campaigns: [],
  companyId: null,
  dealId: null,
  query: {
    showDeleted: false,
  },
  pagination: {
    current_page: 1,
    per_page: 10,
    last_page: 1,
  }
};

const campaigns = (state = initState, action) => {
  switch (action.type) {
    case LOAD_CAMPAIGNS: {
      return {
        ...state,
        campaigns: [...action.campaigns],
        pagination: action.pagination
      };
    }
    case GOTO_PAGE_CAMPAIGN: {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          current_page: action.page,
        }
      };
    }
    case FETCH_CAMPAIGNS: {
      return {
        ...state,
        companyId: action.companyId,
        dealId: action.dealId,
      };
    }
    case SHOW_DELETED_CAMPAIGNS: {
      return {
        ...state,
        query: {
          ...state.query,
          showDeleted: !state.query.showDeleted
        }
      };
    }
    default: {
      return state;
    }
  }
};


export default campaigns;
