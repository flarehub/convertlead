import { ADD_SESSION_TOKEN, REMOVE_SESSION_TOKEN } from "./actions";

const initState = {
  session: {
    token: null,
  }
};

const auth = (state = initState, action) => {
  switch (action.type) {
    case ADD_SESSION_TOKEN: {
      return {
        ...state,
        token: action.token
      }
    }
    case REMOVE_SESSION_TOKEN: {
      return {
        ...state,
        token: null
      }
    }
    default: {
      return state;
    }
  }
};

export default auth;