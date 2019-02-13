import { createSelector } from 'reselect';

export const getDeals = createSelector(
  state => state.deals,
  (state) => {
    const deals = state.deals.filter(deal => {
      return !state.filters.companyId || deal.company.id === state.filters.companyId;
    });

    return deals.filter(deal => {
      return !state.filters.search || (deal.name.search(new RegExp(state.filters.search, 'i')) !== -1 )
    })
  }
);