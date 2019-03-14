import { createSelector } from 'reselect';

export const selectBoxAgents = createSelector(
  state => state.agents.selectBoxAgents,
  selectBoxAgents => selectBoxAgents.map(agent => ({
    key: +agent.id,
    value: +agent.id,
    text: agent.name,
  })),
);

export const selectBoxCompanies = createSelector(
  state => state.agents.agent,
  agent => {
    return agent.companies && agent.companies.map(company => ({
      key: company.id,
      value: company.id,
      text: company.name,
    })) || []
  },
);


export const agentCompaniesIds = createSelector(
  state => state.agents.agent,
  agent => {
    return agent.companies && agent.companies.map(company => Number(company.id)) || []
  },
);

