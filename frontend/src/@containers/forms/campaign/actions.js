export const LOAD_CAMPAIGN = 'LOAD_CAMPAIGN';
export const SAVED_CAMPAIGN = 'SAVED_CAMPAIGN';

export const loadCampaign = form => ({
  type: LOAD_CAMPAIGN,
  form
});


export const savedCampaign = () => ({
  type: SAVED_CAMPAIGN,
});
