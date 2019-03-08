import { connect } from 'react-redux';
import * as thunks from './thunks';
import {getSelectBoxStatuses} from "@models/lead-statuses";

const mapStateToProps = state => ({
  lead: state.leadNotes.lead,
  leadNotes: state.leadNotes.leadNotes,
  leadStatuses: getSelectBoxStatuses,
});

const mapDispatcherToProps = disptach => ({
  loadLead: (companyId, leadId) => disptach(thunks.loadLead(companyId, leadId)),
  createLeadNote: form => disptach(thunks.createLeadNote(form))
});

export default connect(mapStateToProps, mapDispatcherToProps);