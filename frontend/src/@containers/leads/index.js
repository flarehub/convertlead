import { connect } from 'react-redux';
import { addBreadCrumb } from "../breadcrumb/actions";

const mapStateToProps = state => ({
  leads: []
});

const mapDispatchToProps = dispatch  => ({
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);