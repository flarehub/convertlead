import { connect } from 'react-redux';
import { addCompanies } from "./actions";

const mapStateToProps = state => ({
  companies: []
});

const mapDispatchToProps = dispatch  => ({
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);