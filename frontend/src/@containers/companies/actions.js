const ADD_COMPANY = 'ADD_COMPANY';
const UPDATE_COMPANY = 'UPDATE_COMPANY';

export const addCompany = (company) => ({
  type: ADD_COMPANY,
  company
});


export const updateCompany = (company) => ({
  type: UPDATE_COMPANY,
  company
});
