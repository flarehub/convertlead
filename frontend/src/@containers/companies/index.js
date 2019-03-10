import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';
import { selectBoxCompanies } from './selectors';

const mapStateToProps = state => ({
  company: state.companies.company,
  companies: state.companies.companies,
  selectBoxCompanies: selectBoxCompanies(state),
  pagination: state.companies.pagination,
  query: state.companies.query,
  openModal: state.companies.openModal,
  companyGraph: state.companies.graphContactedLeadsAverage,
  companyAverageResponseTime: state.companies.averageResponseTime,
});

const mapDispatchToProps = dispatch => ({
  loadCompanies: () => dispatch(thunks.getCompanies()),
  searchCompanies: search => dispatch(thunks.searchCompanies(search)),
  updateLockStatusCompany: company => dispatch(thunks.updateLockStatusCompany(company)),
  loadSelectBoxCompanies: (search, agentId = null) => dispatch(thunks.loadSelectBoxCompanies(search, agentId)),
  gotoCompaniesPage: activePage => dispatch(thunks.gotoCompaniesPage(activePage)),
  sort: field => dispatch(thunks.onSortCompanies(field)),
  openCompanyModal: open => dispatch(actions.openCompanyModal(open)),
  deleteCompany: id => dispatch(thunks.deleteCompany(id)),
  toggleShowDeleted: () => dispatch(thunks.toggleShowDeleted()),
  getCompanyBy: (id, breadCrumb) => dispatch(thunks.getCompanyBy(id, breadCrumb)),
  getCompanyGraph: (graphContext, companyId, filters) => dispatch(thunks.getCompanyGraph(graphContext, companyId, filters)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
