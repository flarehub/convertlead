import { connect } from 'react-redux';
import { addBreadCrumb } from "../breadcrumb/actions";

const mapStateToProps = state => ({
  companies: []
});

const mapDispatchToProps = dispatch  => ({
  addBreadCrumb: (pageInfo, reset = true) => dispatch(addBreadCrumb(pageInfo, reset))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);