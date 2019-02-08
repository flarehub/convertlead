export const ADD_COMPANIES = 'ADD_COMPANIES';
export const ADD_COMPANY = 'ADD_COMPANY';
export const UPDATE_COMPANY = 'UPDATE_COMPANY';

export const addCompanies = (companies, pagination) => ({
  type: ADD_COMPANIES,
  companies,
  pagination,
});

export const addCompany = company => ({
  type: ADD_COMPANY,
  company
});


export const updateCompany = company => ({
  type: UPDATE_COMPANY,
  company
});
