import { connect } from 'react-redux';
import * as thunks from "./thunks";
import * as actions from "./actions";
import {getDeals} from "./selectors";

const mapStateToProps = state => ({
  deals: getDeals(state)
});

const mapDispatchToProps = dispatch  => ({
  getCompanyDeals: () => dispatch(thunks.getCompanyDeals()),
  filterDealsByCompany: id => dispatch(actions.filterDealsByCompany(id)),
  searchDealCompaniesBy: search => dispatch(actions.searchDealCompaniesBy(search))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);