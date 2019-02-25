import { connect } from 'react-redux';
import * as thunks from './thunks';

const mapStateToProps = state => ({
  campaigns: state.campaigns.campaigns,
  pagination: state.campaigns.pagination,
  query: state.campaigns.query,
});

const mapDispatcheToProps = dispatch => ({
  loadCampaigns: (companyId, dealId) => dispatch(thunks.loadCampaigns(companyId, dealId)),
  gotoPage: page => dispatch(thunks.gotoPage(page)),
  sort: field => dispatch(thunks.sortCampaigns(field)),
  toggleShowDeleted: dispatch(thunks.toggleShowDeletedCampaigns())
});

export default connect(mapStateToProps, mapDispatcheToProps);
