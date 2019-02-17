export const LOAD_COMPANY = 'LOAD_COMPANY';
export const CHANGE_COMPANY = 'CHANGE_COMPANY';
export const SAVED_COMPANY = 'SAVED_COMPANY';


export const loadCompany = form => ({
  type: LOAD_COMPANY,
  form,
});
export const changeCompany = form => ({
  type: CHANGE_COMPANY,
  form,
});

export const savedCompany = () => ({
  type: SAVED_COMPANY,
});
