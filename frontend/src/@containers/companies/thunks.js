import { addCompanies } from "./actions";

export const getCompanies = () => {
  return (dispatch) => {
    dispatch(addCompanies([{ name: 'vasea' }]));
  }
};
