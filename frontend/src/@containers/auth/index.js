import { connect } from 'react-redux';
import { compose } from 'recompose';
import { addSessionToken, removeSessionToken } from "./actions";
import * as thunks from "./thunks";

const mapStateToProps = (state) => {
  return ({
    session: state.auth.session,
  });
};

const mapActionsToProps = dispatch => ({
  login: (email, password) => dispatch(thunks.login(email, password)),
  addSessionToken: ({ token, refreshToken }) => dispatch(addSessionToken({
    token,
    refreshToken
  })),
  removeSessionToken: () => dispatch(removeSessionToken()),
});

export default connect(mapStateToProps, mapActionsToProps);