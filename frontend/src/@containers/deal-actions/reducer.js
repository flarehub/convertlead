import {FETCH_DEAL_ACTIONS_SUCCESS} from "./actions";
import {fromJS, List} from "immutable";

const initState = fromJS({
  actions: [],
});

const dealActions = (state = initState, action) => {
  switch (action.type) {
    case FETCH_DEAL_ACTIONS_SUCCESS: {
      return state.set('actions', fromJS(action.actions))
    }
    default:
  }
  return state;
};

export default dealActions;
