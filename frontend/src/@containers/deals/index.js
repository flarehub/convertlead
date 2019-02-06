import { connect } from 'react-redux';
import * as thunks from "./thunks";
import {getDeals} from "./selectors";

const mapStateToProps = state => ({
  deals: getDeals(state)
});

const mapDispatchToProps = dispatch  => ({
  getCompanyDeals: () => dispatch(thunks.getCompanyDeals())
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
);