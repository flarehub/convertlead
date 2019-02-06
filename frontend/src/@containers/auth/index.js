import { connect } from 'react-redux';
import * as thunks from "./thunks";

const mapStateToProps = (state) => {
  return ({
    isAuthorised: state.auth.session.isAuthorised,
  });
};

const mapActionsToProps = dispatch => ({
  autoLogin: () => dispatch(thunks.autoLogin()),
  login: (email, password) => dispatch(thunks.login(email, password)),
  logout: () => dispatch(thunks.logout()),
});

export default connect(mapStateToProps, mapActionsToProps);