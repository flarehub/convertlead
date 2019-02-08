import { ADD_COMPANIES } from './actions';

const initState = {
  companies: [],
  pagination: {}
};

const companies = (state = initState, action) => {
  switch (action.type) {
    case ADD_COMPANIES: {
      return {
        ...state,
        companies: [...action.companies],
        pagination: action.pagination,
      }
    }
    default: {
      return state
    }
  }
};

export default companies;