import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';
import {
  getDeals,
  getSelectBoxDealCampaigns,
  getSelectBoxDealCampaignAgents,
  getSelectBoxDeals,
} from './selectors';

const mapStateToProps = state => ({
  deals: getDeals(state),
  selectBoxDeals: getSelectBoxDeals(state),
  selectBoxDealCampaigns: getSelectBoxDealCampaigns(state),
  selectBoxDealCampaignAgents: getSelectBoxDealCampaignAgents(state),
});

const mapDispatchToProps = dispatch => ({
  getCompanyDeals: () => dispatch(thunks.getCompanyDeals()),
  deleteDeal: (companyId, id) => dispatch(thunks.deleteDeal(companyId, id)),
  filterDealsByCompany: id => dispatch(actions.filterDealsByCompany(id)),
  filterDealsByDealId: id => dispatch(actions.filterDealsById(id)),
  filterDealCampaignsById: id => dispatch(actions.filterDealCampaignsById(id)),
  searchDealCompaniesBy: search => dispatch(actions.searchDealCompaniesBy(search)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
