import { connect } from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';
import { selectBoxCompanies } from './reselect';

const mapStateToProps = state => ({
  company: state.companies.company,
  companies: state.companies.companies,
  selectBoxCompanies: selectBoxCompanies(state),
  pagination: state.companies.pagination,
  query: state.companies.query,
  openModal: state.companies.openModal,
  graphContactedLeadsAverage: state.companies.graphContactedLeadsAverage,
  averageResponseTime: state.companies.averageResponseTime,
});

const mapDispatchToProps = dispatch => ({
  loadCompanies: (page = 1, perPage = 10, search = '', sort = {
    name: true,
    deals: null,
    leads: null,
    agents: null,
    avg_response: null,
  }) => dispatch(thunks.loadCompanies(page, perPage, search, sort)),
  searchCompanies: search => dispatch(thunks.searchCompanies(search)),
  updateLockStatusCompany: company => dispatch(thunks.updateLockStatusCompany(company)),
  loadSelectBoxCompanies: search => dispatch(thunks.loadSelectBoxCompanies(search)),
  openCompaniesPage: activePage => dispatch(thunks.openCompaniesPage(activePage)),
  sort: field => dispatch(thunks.onSortCompanies(field)),
  openCompanyModal: open => dispatch(actions.openCompanyModal(open)),
  deleteCompany: id => dispatch(thunks.deleteCompany(id)),
  toggleShowDeleted: () => dispatch(thunks.toggleShowDeleted()),
  getCompanyBy: id => dispatch(thunks.getCompanyBy(id)),
  getCompanyGraph: (graphContext, companyId, filters) => dispatch(thunks.getCompanyGraph(graphContext, companyId, filters)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
