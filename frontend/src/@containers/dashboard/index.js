import { connect } from 'react-redux';
import { resetBreadCrumbToDefault } from "../breadcrumb/actions";

const mapStateToProps = state => ({
  deals: []
});

const mapDispatchToProps = dispatch  => ({
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);