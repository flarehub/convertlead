import { connect } from 'react-redux';
import * as thunks from './thunks';

const mapStateToProps = state => ({
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  getUserProfile: () => dispatch(thunks.getUserProfile()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
