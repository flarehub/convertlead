import {api} from "../../@services";

export const fetchAgencyCampaigns = (companyId, dealId, params) => {
  return api.get(`/v1/agency/companies/${companyId}/deals/${dealId}/campaigns`, {
    params
  })
};

export const fetchCompanyCampaigns = (dealId, params) => {
  return api.get(`/v1/company/deals/${dealId}/campaigns`, {
    params
  })
};
