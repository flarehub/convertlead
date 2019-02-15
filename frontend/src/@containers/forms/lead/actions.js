export const LOAD_LEAD = 'LOAD_LEAD';
export const SAVED_LEAD = 'SAVED_LEAD';

export const loadLead = form => ({
  type: LOAD_LEAD,
  form
});

export const savedLead = () => ({
  type: SAVED_LEAD,
});
