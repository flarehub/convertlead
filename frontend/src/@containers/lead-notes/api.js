import {api, Auth} from "../../@services";

export const fetchAgencyCompanyLead = (companyId, id) => {
  return api.get(`/v1/agency/companies/${companyId}/leads/${id}`);
};

export const fetchCompanyLead = id => {
  return api.get(`/v1/company/leads/${id}`);
};

export const createAgencyCompanyLeadNote = (companyId, leadId, form) => {
  return api.post(`/v1/agency/companies/${companyId}/leads/${leadId}/notes`, form);
};

export const createCompanyLeadNote = (leadId, form) => {
  return api.post(`/v1/company/leads/${leadId}/notes`, form);
};

