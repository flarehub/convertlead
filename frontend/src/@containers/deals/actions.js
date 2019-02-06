export const ADD_COMPANY_DEALS = 'ADD_COMPANY_DEALS';
export const CREATE_COMPANY_DEAL = 'CREATE_COMPANY_DEAL';
export const UPDATE_COMPANY_DEAL = 'UPDATE_COMPANY_DEAL';
export const DELETE_COMPANY_DEAL = 'DELETE_COMPANY_DEAL';

export const addCompanyDeals = deals => ({
  type: ADD_COMPANY_DEALS,
  deals,
});

export const createCompanyDeal = deal => ({
  type: CREATE_COMPANY_DEAL,
  deal
});

export const updateCompanyDeal = deal => ({
  type: UPDATE_COMPANY_DEAL,
  deal
});

export const deleteCompanyDeal = id => ({
  type: DELETE_COMPANY_DEAL,
  id
});

