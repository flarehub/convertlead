import { connect } from "react-redux";
import * as thunks from './thunks';
import {getActionBy, getMappedActions} from "./selectors";

const mapStateToProps = state => ({
  actions: getMappedActions(state),
  actionsOriginal: state.dealActions.get('actions').toJS(),
  getActionBy: actionId => getActionBy(actionId, state),
});

const mapDispatchToProps = dispatch => ({
  fetchDealActions: (dealId) => dispatch(thunks.fetchDealAction(dealId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
