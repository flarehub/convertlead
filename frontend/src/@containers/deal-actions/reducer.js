import {FETCH_DEAL_ACTIONS_SUCCESS} from "./actions";

const initState = {
  actions: [],
};

const dealActions = (state = initState, action) => {
  switch (action.type) {
    case FETCH_DEAL_ACTIONS_SUCCESS: {
      return {
        actions: action.actions
      }
    }
    default:
  }
  return state;
};

export default dealActions;
