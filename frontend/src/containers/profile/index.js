import { connect } from 'react-redux';
import { getUserProfile, updateUserProfile } from "./actions";

const mapStateToProps = state => {
	return state;
};

const mapDispatchToProps = dispatch => ({
	updateProfile: profile => dispatch(updateUserProfile(profile)),
	getUserProfile: () => dispatch(getUserProfile())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
);