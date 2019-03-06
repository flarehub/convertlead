import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';
import { agentCompaniesIds, selectBoxAgents, selectBoxCompanies } from "./selectors";

const mapStateToProps = state => ({
  agents: state.agents.agents,
  agent: state.agents.agent,
  agentCompaniesIds: agentCompaniesIds(state),
  selectBoxAgentCompanies: selectBoxCompanies(state),
  selectBoxAgents: selectBoxAgents(state),
  pagination: state.agents.pagination,
  query: state.agents.query,
  openModalStatus: state.agents.openModalStatus,
  graphContactedLeadsAverage: state.agents.graphContactedLeadsAverage,
  averageResponseTime: state.agents.averageResponseTime,
});

const mapDispatchToProps = dispatch => ({
  loadAgents: () => dispatch(thunks.loadAgents()),
  getAgent: (id, addBreadCrumb = false) => dispatch(thunks.getAgent(id, addBreadCrumb)),
  filterAgents: filters => dispatch(thunks.filterAgents(filters)),
  search: search => dispatch(thunks.searchAgents(search)),
  sort: sort => dispatch(thunks.sortAgents(sort)),
  gotoPage: activePage => dispatch(thunks.gotoPage(activePage)),
  delete: (agentId) => dispatch(thunks.deleteAgent(agentId)),
  edit: (id, agent) => dispatch(thunks.editAgent(id, agent)),
  create: agent => dispatch(thunks.createAgent(agent)),
  openModal: open => dispatch(actions.openAgentModal(open)),
  toggleShowDeleted: open => dispatch(thunks.toggleShowDeleted(open)),
  loadSelectBoxAgents: filters => dispatch(thunks.loadSelectBoxAgents(filters)),
  getAgentGraph: (graphContext, agentId, filters) => dispatch(thunks.getAgentGraph(graphContext, agentId, filters)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
