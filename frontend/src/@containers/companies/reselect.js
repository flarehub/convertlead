import { createSelector } from 'reselect';

export const selectBoxCompanies = createSelector(
  state => state.companies.selectBoxCompanies,
  selectBoxCompanies => selectBoxCompanies.map(company => ({
    key: company.id,
    value: company.id,
    text: company.name,
  })),
);
