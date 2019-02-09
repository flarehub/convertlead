export const ADD_AGENTS = 'ADD_AGENTS';
export const CREATE_AGENT = 'CREATE_AGENT';
export const DELETE_AGENT = 'DELETE_AGENT';
export const EDIT_AGENT = 'EDIT_AGENT';
export const FILTER_AGENTS = 'FILTER_AGENTS';
export const SEARCH_AGENTS = 'SEARCH_AGENTS';
export const SORT_AGENTS = 'SORT_AGENTS';
export const GOTO_PAGE = 'GOTO_PAGE';
export const OPEN_AGENT_MODAL = 'OPEN_AGENT_MODAL';
export const SHOW_DELETED_AGENTS = 'SHOW_DELETED_AGENTS';

export const addAgents = (agents, pagination) => ({
  type: ADD_AGENTS,
  agents,
  pagination,
});

export const createAgent = agent => ({
  type: CREATE_AGENT,
  agent
});

export const editAgent = (id, agent) => ({
  type: EDIT_AGENT,
  id,
  agent,
});

export const deleteAgent = id => ({
  type: DELETE_AGENT,
});

export const filterAgents = filters => ({
  type: FILTER_AGENTS,
  filters,
});

export const sortAgents = field => ({
  type: SORT_AGENTS,
  field
});

export const searchAgents = search => ({
  type: SEARCH_AGENTS,
  search
});

export const gotoPage = activePage => ({
  type: GOTO_PAGE,
  activePage
});

export const openAgentModal = open => ({
  type: OPEN_AGENT_MODAL,
  open
});

export const toggleShowDeleted = () => ({
  type: SHOW_DELETED_AGENTS
});