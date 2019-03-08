import {api, Auth} from "@services";

export const fetchLeads = params => {
  return api.get(`/v1/${Auth.role}/leads`, {
    params,
  });
};

export const deleteAgencyCompanyLead = (companyId, id) => {
  return api.delete(`/v1/${Auth.role}/companies/${companyId}/leads/${id}`);
};

export const deleteCompanyLead = id => {
  return api.delete(`/v1/${Auth.role}/leads/${id}`);
};

