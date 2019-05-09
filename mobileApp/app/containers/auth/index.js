import { connect } from 'react-redux';
import * as thunks from './thunks';
// import {Auth} from "@services";

const mapStateToProps = state => ({
  // isAuthorised: state.auth.session.isAuthorised || Auth.isAuthorised(),
});

const mapActionsToProps = dispatch => ({
  // autoLogin: () => dispatch(thunks.autoLogin()),
  // login: (email, password) => dispatch(thunks.login(email, password)),
  // logout: () => dispatch(thunks.logout()),
});

export default connect(mapStateToProps, mapActionsToProps);
