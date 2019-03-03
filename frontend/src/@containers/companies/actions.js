export const ADD_COMPANIES = 'ADD_COMPANIES';
export const ADD_COMPANY = 'ADD_COMPANY';
export const UPDATE_COMPANY = 'UPDATE_COMPANY';
export const SORT_COMPANIES = 'SORT_COMPANIES';
export const SEARCH_COMPANIES = 'SEARCH_COMPANIES';
export const TOGGLE_SHOW_DELETED = 'TOGGLE_WITH_DELETED';
export const OPEN_COMPANY_MODAL = 'OPEN_COMPANY_MODAL';
export const ADD_SELECT_BOX_COMPANIES = 'ADD_SELECT_BOX_COMPANIES';
export const LOAD_COMPANY = 'LOAD_COMPANY';

export const addCompanies = (companies, pagination) => ({
  type: ADD_COMPANIES,
  companies,
  pagination,
});

export const addSelectBoxCompanies = companies => ({
  type: ADD_SELECT_BOX_COMPANIES,
  companies,
});

export const addCompany = company => ({
  type: ADD_COMPANY,
  company,
});


export const updateCompany = company => ({
  type: UPDATE_COMPANY,
  company,
});

export const sortCompanies = field => ({
  type: SORT_COMPANIES,
  field,
});
export const openCompanyModal = open => ({
  type: OPEN_COMPANY_MODAL,
  open,
});

export const toggleShowDeleted = () => ({
  type: TOGGLE_SHOW_DELETED,
});

export const loadCompany = company => ({
  type: LOAD_COMPANY,
  company
});