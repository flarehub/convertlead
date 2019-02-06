import { createSelector } from 'reselect';

export const getDeals = createSelector(
  state => state.deals.deals,
  (deals) => deals
);