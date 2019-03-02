import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as R from 'ramda';

const mapStateToProps = state => ({
  lead: state.leadNotes.lead,
  leadNotes: state.leadNotes.leadNotes,
});

const mapDispatcherToProps = disptach => ({
  loadLead: (companyId, leadId) => disptach(thunks.loadLead(companyId, leadId)),
  createLeadNote: form => disptach(thunks.createLeadNote(form))
});

export default connect(mapStateToProps, mapDispatcherToProps);