import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';

const mapStateToProps = state => ({
  campaign: state.integrations.optinForm.campaign,
  integrationForm: state.integrations.optinForm.campaign.integration_config,
  form: state.integrations.optinForm.form,
});

const mapDispatcherToProps = disptach => ({
  loadCampaignBy: uuid => disptach(thunks.loadCampaignBy(uuid)),
  createLead: form => disptach(thunks.createLead(form)),
  changeForm: field => disptach(actions.changeField(field)),
  resetForm: form => disptach(actions.resetForm(form))
});

export default connect(mapStateToProps, mapDispatcherToProps);
