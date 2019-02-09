import { connect } from 'react-redux';
import * as thunks from './thunks';

const mapStateToProps = state => ({
  companies: state.companies.companies,
  pagination: state.companies.pagination
});

const mapDispatchToProps = dispatch  => ({
  loadCompanies: (page = 1, perPage = 10, search = '', sort = {
    name: true,
    deals: null,
    leads: null,
    agents: null,
    avg_response: null,
  }) => dispatch(thunks.loadCompanies(page, perPage, search, sort))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);