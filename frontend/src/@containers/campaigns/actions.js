export const FETCH_CAMPAIGNS = 'FETCH_CAMPAIGNS';
export const LOAD_DEAL_CAMPAIGNS = 'LOAD_DEAL_CAMPAIGNS';
export const SHOW_DELETED_CAMPAIGNS = 'SHOW_DELETED_CAMPAIGNS';
export const GOTO_PAGE_CAMPAIGN = 'GOTO_PAGE_CAMPAIGN';
export const SORT_CAMPAIGNS = 'SORT_CAMPAIGNS';

export const fetchCampaigns = (companyId, dealId) => ({
  type: FETCH_CAMPAIGNS,
  companyId,
  dealId,
});

export const loadDealCampaigns = (campaigns, pagination) => ({
  type: LOAD_DEAL_CAMPAIGNS,
  campaigns,
  pagination,
});

export const sortCampaigns = field => ({
  type: SORT_CAMPAIGNS,
  field,
});

export const toggleShowDeletedCampaigns = () => ({
  type: SHOW_DELETED_CAMPAIGNS,
});

export const gotoPageCampaigns = page => ({
  type: GOTO_PAGE_CAMPAIGN,
  page,
});
