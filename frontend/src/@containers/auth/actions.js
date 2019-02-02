export const ADD_SESSION_TOKEN = 'ADD_SESSION_TOKEN';
export const REMOVE_SESSION_TOKEN = 'REMOVE_SESSION_TOKEN';

export const addSessionToken = token => ({
  type: ADD_SESSION_TOKEN,
  token
});

export const removeSessionToken = () => ({
  type: REMOVE_SESSION_TOKEN
});
