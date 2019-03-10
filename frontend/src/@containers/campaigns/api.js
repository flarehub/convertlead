import {api} from "../../@services";

export const fetchAgencyDealCampaigns = (companyId, dealId, params) => {
  return api.get(`/v1/agency/companies/${companyId}/deals/${dealId}/campaigns`, {
    params
  })
};

export const fetchCompanyDealCampaigns = (dealId, params) => {
  return api.get(`/v1/company/deals/${dealId}/campaigns`, {
    params
  })
};
