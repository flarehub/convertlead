export const LOAD_AGENT = 'LOAD_AGENT';
export const SAVED_AGENT = 'SAVED_AGENT';


export const loadAgent = form => ({
  type: LOAD_AGENT,
  form
});

export const savedAgent = () => ({
  type: SAVED_AGENT,
});
