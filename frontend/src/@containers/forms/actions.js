export const LOGIN_USER = 'LOGIN_USER';
export const SAVED_USER_PROFILE = 'SAVED_USER_PROFILE';

export const LOAD_AGENT = 'LOAD_AGENT';
export const SAVED_AGENT = 'SAVED_AGENT';

export const LOAD_COMPANY = 'LOAD_COMPANY';
export const SAVED_COMPANY = 'SAVED_COMPANY';

export const LOAD_DEAL = 'CREATE_DEAL';
export const SAVED_DEAL = 'SAVED_DEAL';

export const LOAD_CAMPAIGN = 'LOAD_CAMPAIGN';
export const SAVED_CAMPAIGN = 'SAVED_CAMPAIGN';

export const LOAD_LEAD = 'LOAD_LEAD';
export const SAVED_LEAD = 'SAVED_LEAD';

export const login = form => ({
  type: LOGIN_USER,
  form
});

export const savedUserProfile = form => ({
  type: SAVED_USER_PROFILE,
  form
});

export const loadAgent = form => ({
  type: LOAD_AGENT,
  form
});

export const loadCompany = form => ({
  type: LOAD_COMPANY,
  form
});

export const loadDeal = form => ({
  type: LOAD_DEAL,
  form,
});

export const loadCampaign = form => ({
  type: LOAD_CAMPAIGN,
  form
});

export const loadLead = form => ({
  type: LOAD_LEAD,
  form
});

export const savedAgent = () => ({
  type: SAVED_AGENT,
});

export const savedCompany = () => ({
  type: SAVED_COMPANY,
});

export const savedDeal = () => ({
  type: SAVED_DEAL,
});

export const savedCampaign = () => ({
  type: SAVED_CAMPAIGN,
});

export const savedLead = () => ({
  type: SAVED_LEAD,
});