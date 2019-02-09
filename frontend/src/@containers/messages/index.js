import { connect } from 'react-redux';
import {sendMessage, dropMessages} from "./actions";


const mapStateToProps = state => ({
  messages: state.messages
});

const mapDispatcherToProps = dispatch => ({
  addMessage: (message, error = false) => dispatch(sendMessage(message, error)),
  dropMessages: () => dispatch(dropMessages())
});

export default connect(
  mapStateToProps,
  mapDispatcherToProps
);