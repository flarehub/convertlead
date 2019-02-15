import { createSelector } from 'reselect';

export const selectBoxCompanies = createSelector(
  state => state.companies.selectBoxCompanies,
  selectBoxCompanies => {
    return selectBoxCompanies.map(company => {
      return {
        key: company.id,
        value: company.id,
        text: company.name,
      }
    });
  },
);