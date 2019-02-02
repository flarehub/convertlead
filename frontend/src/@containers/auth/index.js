import { connect } from 'react-redux';
import {addSessionToken, removeSessionToken} from "./actions";

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapActionsToProps = dispatch => ({
  addSessionToken: (token) => dispatch(addSessionToken(token)),
  removeSessionToken: () => dispatch(removeSessionToken()),
});

export default connect(mapStateToProps, mapActionsToProps);