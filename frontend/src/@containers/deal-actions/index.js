import { connect } from "react-redux";
import * as thunks from './thunks';
import {getMappedActions} from "./selectors";

const mapStateToProps = state => ({
  actions: getMappedActions(state),
});

const mapDispatchToProps = dispatch => ({
  fetchDealActions: (dealId) => dispatch(thunks.fetchDealAction(dealId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
