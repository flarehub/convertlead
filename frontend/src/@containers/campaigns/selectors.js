import { createSelector } from 'reselect';

export const getDeal = createSelector(
  [state => state.deals, state => state.campaigns.dealId],
  ({ deals }, dealId) => {
    console.log(deals.find(deal => deal.id == dealId),);
    return deals.find(deal => +deal.id === +dealId);
  }
);