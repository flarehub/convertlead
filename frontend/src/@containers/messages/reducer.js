import { ADD_MESSAGE, DROP_MESSAGES } from "./actions";

const initState = {
  messages: []
};

const messages = (state = initState, action) => {
  switch (action.type) {
    case ADD_MESSAGE: {
      return {
        ...state,
        messages: [...state.messages, {
          ...action
        }]
      }
    }
    case DROP_MESSAGES: {
      return {
        ...state,
        messages: [],
      }
    }
    default: {
      return state;
    }
  }
};

export default messages;