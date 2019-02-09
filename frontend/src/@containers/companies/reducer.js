import { ADD_COMPANIES } from './actions';

const initState = {
  companies: [],
  pagination: {
    current_page: 1,
    last_page: 1,
  }
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