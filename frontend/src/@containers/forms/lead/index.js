import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';

const mapStateToProps = (state) => ({
  form: state.forms.lead,
  show: state.forms.lead.show,
});

const mapDispatcherToState = dispatch => ({
  loadForm: lead => dispatch(actions.loadLead(lead)),
  changeForm: lead => dispatch(actions.changeLead(lead)),
  saveForm: lead => dispatch(thunks.saveLead(lead)),
});

export default connect(mapStateToProps, mapDispatcherToState);