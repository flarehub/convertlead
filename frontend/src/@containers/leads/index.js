import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from "./actions";

const mapStateToProps = state => ({
  leads: state.leads,
  pagination: state.companies.pagination,
  query: state.companies.query,
  openModal: state.companies.openModal,
});

const mapDispatchToProps = dispatch  => ({
  loadLeads: () => dispatch(thunks.loadLeads()),
  updateLead: (id, lead) => dispatch(thunks.updateLead(id, lead)),
  removeLead: id => dispatch(thunks.removeLead(id)),
  filterLeads: filters => dispatch(thunks.filterLeads(filters)),
  searchLeads: search => dispatch(thunks.searchLeads(search)),
  gotoPage: activePage => dispatch(thunks.gotoPage(activePage)),
  toggleShowDeleted: () => dispatch(thunks.toggleShowDeleted()),
  sortLeads: () => dispatch(thunks.sortLeads()),
  openLeadModal: open => dispatch(actions.openLeadModal(open)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
