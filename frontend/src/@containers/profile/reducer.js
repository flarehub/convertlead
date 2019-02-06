import {GET_USER_PROFILE, UPDATE_USER_PROFILE} from './actions';

const initialState = {
	name: null,
	role: null,
	permissions: [],
	avatar: null,
};

function profile(state = initialState, action) {
	switch (action.type)  {
		case GET_USER_PROFILE: {
			return state
		}
		case UPDATE_USER_PROFILE: {
			console.log('hui', action.profile);
			return { ...state, ...action.profile  }
		}
		default: {
			return state
		}
	}
}

export default profile;