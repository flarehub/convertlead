import { api } from "@services";

export const companyAgentLeadGraph = (agentId, filters) => api.get(`/v1/company/agents/${agentId}/graph/${filters.graphType}`, {
  params: {
    ...filters
  }
});


export const agentLeadGraph = filters => api.get(`/v1/agent/leads/graph/${filters.graphType}`, {
  params: {
    ...filters
  }
});

