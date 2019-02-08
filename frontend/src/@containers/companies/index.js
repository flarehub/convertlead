import { connect } from 'react-redux';
import * as thunks from './thunks';

const mapStateToProps = state => ({
  companies: state.companies.companies,
  pagination: state.companies.pagination
});

const mapDispatchToProps = dispatch  => ({
  loadCompanies: (page, perPage) => dispatch(thunks.loadCompanies(page, perPage))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);