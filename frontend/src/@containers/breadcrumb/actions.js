export const ADD_BREADCRUMB = 'ADD_BREADCRUMB';
export const RESET_BREADCRUMB = 'RESET_BREADCRUMB';

export const addBreadCrumb = (crumb, reset = true) => {
  return {
    type: ADD_BREADCRUMB,
    crumb,
    reset
  }
};

export const resetBreadCrumbToDefault = () => {
  return {
    type: RESET_BREADCRUMB,
  }
};