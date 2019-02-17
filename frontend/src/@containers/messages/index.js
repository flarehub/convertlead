import { connect } from 'react-redux';
import * as thunks from './thunks';


const mapStateToProps = state => ({
});

const mapDispatcherToProps = dispatch => ({
  sendMessage: (message, error = false) => dispatch(thunks.sendMessage(message, error)),
  sendMessageInfo: message => dispatch(thunks.sendMessageInfo(message)),
  sendMessageWarn: message => dispatch(thunks.sendMessageWarn(message)),
});

export default connect(
  mapStateToProps,
  mapDispatcherToProps,
);
