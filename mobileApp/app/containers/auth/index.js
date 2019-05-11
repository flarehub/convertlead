import {connect} from 'react-redux';
import * as thunks from './thunks';
import * as actions from './actions';

const mapStateToProps = state => ({
    isAuthorised: state.auth.session.isAuthorised,
    session: state.auth.session
});

const mapActionsToProps = dispatch => ({
    updateUserProfile: (profile) => dispatch(actions.updateUserProfile(profile)),
    addSessionToken: (tokenData) => dispatch(actions.addSessionToken(tokenData)),
    addDeviceToken: (deviceToken) => dispatch(actions.addDeviceToken(deviceToken)),
    registerDeviceToken: () => dispatch(thunks.registerDeviceToken()),
    logout: () => dispatch(actions.removeSessionToken(), actions.removeUserProfile()),
});

export default connect(mapStateToProps, mapActionsToProps);
