import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';

const mapStateToProps = state => ({
  form: state.forms.automation.form,
  show: state.forms.automation.form.show,
  required: state.forms.automation.required,
});

const mapDispatcherToState = dispatch => ({
  loadForm: agent => dispatch(actions.loadAutomationAction(agent)),
  changeForm: agent => dispatch(actions.changeAutomationAction(agent)),
  saveForm: agent => dispatch(thunks.saveAutomationAction(agent)),
});

export default connect(mapStateToProps, mapDispatcherToState);
