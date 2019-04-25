import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';
import {getSelectBoxStatuses} from "./selectors";

const mapStateToProps = state => ({
  leads: state.leads.leads,
  newLeadsCount: state.leads.newLeadsCount,
  agentLeads: state.leads.agentLeads,
  pagination: state.leads.pagination,
  statuses: state.leads.statuses,
  selectBoxStatuses: getSelectBoxStatuses(state),
  selectBoxDates: state.agents.selectBoxDates,
  query: state.leads.query,
  openModal: state.leads.openModal,
  openModalStatus: state.leads.openModalStatus,
});

const mapDispatchToProps = dispatch => ({
  loadLeads: () => dispatch(thunks.loadLeads()),
  delete: (companyId, id) => dispatch(thunks.deleteLead(companyId, id)),
  filterLeads: filters => dispatch(thunks.filterLeads(filters)),
  searchLeads: search => dispatch(thunks.searchLeads(search)),
  gotoPage: activePage => dispatch(thunks.gotoPage(activePage)),
  toggleShowDeleted: () => dispatch(thunks.toggleShowDeleted()),
  sort: field => dispatch(thunks.sortLeads(field)),
  openModal: open => dispatch(actions.openLeadModal(open)),
  searchAgentLeads: search => dispatch(thunks.searchAgentLeads(search)),
  agentLeadsByStatuses: statuses => dispatch(thunks.agentLeadsByStatuses(statuses)),
  scrollToPage: page => dispatch(thunks.scrollToPage(page)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
