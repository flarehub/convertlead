import {ADD_COMPANY_DEALS, CREATE_COMPANY_DEAL, DELETE_COMPANY_DEAL, UPDATE_COMPANY_DEAL} from "./actions";

const initState = {
  deals: []
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
    default: {
      return state;
    }
  }
}

export default deals;