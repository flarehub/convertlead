import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';
import { selectBoxAgents } from "./selectors";

const mapStateToProps = state => ({
  agents: state.agents.agents,
  selectBoxAgents: selectBoxAgents(state),
  pagination: state.agents.pagination,
  query: state.agents.query,
  openModalStatus: state.agents.openModalStatus,
});

const mapDispatchToProps = dispatch => ({
  loadAgents: () => dispatch(thunks.loadAgents()),
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
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
