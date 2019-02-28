import { createSelector } from 'reselect';

export const selectBoxAgents = createSelector(
  state => state.agents.selectBoxAgents,
  selectBoxAgents => selectBoxAgents.map(agent => ({
    key: agent.id,
    value: agent.id,
    text: agent.name,
    image: { avatar: true, src: agent.avatar_path },
  })),
);
