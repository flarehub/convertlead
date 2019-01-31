import {GET_USER_PROFILE, UPDATE_USER_PROFILE} from './actions';

const initialState = {
	name: 'Dmitri',
};

function profile(state = initialState, action) {
	switch (action.type)  {
		case GET_USER_PROFILE: {
			return state.profile.name
		}
		case UPDATE_USER_PROFILE: {
			return { ...state, ...action.profile  }
		}
		default: {
			return state
		}
	}
}

export default profile;