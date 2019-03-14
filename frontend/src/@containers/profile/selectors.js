import { createSelector } from 'reselect';

export const getSelectBoxAgencies = createSelector(
  state => state.profile.profile,
  profile => {
    return profile.agencies && profile.agencies.map(agency => ({
      key: agency.agency_company_id,
      value: agency.agency_company_id,
      text: agency.name,
    }))
  }
);