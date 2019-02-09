export const ADD_MESSAGE = 'ADD_MESSAGE';
export const DROP_MESSAGES = 'DROP_MESSAGES';

export const sendMessage = (message, error = false) => ({
  type: ADD_MESSAGE,
  message,
  error
});

export const dropMessages = () => ({
  type: DROP_MESSAGES,
});
