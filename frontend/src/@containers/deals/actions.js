export const ADD_COMPANY_DEALS = 'ADD_COMPANY_DEALS';
export const CREATE_COMPANY_DEAL = 'CREATE_COMPANY_DEAL';
export const UPDATE_COMPANY_DEAL = 'UPDATE_COMPANY_DEAL';
export const DELETE_COMPANY_DEAL = 'DELETE_COMPANY_DEAL';
export const FILTER_DEALS_BY_COMPANY = 'FILTER_DEALS_BY_COMPANY';
export const FILTER_DEALS_BY_ID = 'FILTER_DEALS_BY_ID';
export const FILTER_DEAL_CAMPAIGNS_BY_ID = 'FILTER_DEAL_CAMPAIGNS_BY_ID';
export const SEARCH_DEALS_BY_COMPANY = 'SEARCH_DEALS_BY_COMPANY';

export const addCompanyDeals = deals => ({
  type: ADD_COMPANY_DEALS,
  deals,
});

export const createCompanyDeal = deal => ({
  type: CREATE_COMPANY_DEAL,
  deal,
});

export const updateCompanyDeal = deal => ({
  type: UPDATE_COMPANY_DEAL,
  deal,
});

export const deleteCompanyDeal = id => ({
  type: DELETE_COMPANY_DEAL,
  id,
});


export const filterDealsByCompany = id => ({
  type: FILTER_DEALS_BY_COMPANY,
  id,
});

export const filterDealsById = id => ({
  type: FILTER_DEALS_BY_ID,
  id,
});

export const filterDealCampaignsById = id => ({
  type: FILTER_DEAL_CAMPAIGNS_BY_ID,
  id,
});


export const searchDealCompaniesBy = search => ({
  type: SEARCH_DEALS_BY_COMPANY,
  search,
});
