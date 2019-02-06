import {UPDATE_USER_PROFILE} from './actions';

const initialState = {
	name: null,
	role: null,
	permissions: [],
	avatar: null,
};

function profile(state = initialState, action) {
	switch (action.type)  {
		case UPDATE_USER_PROFILE: {
			return { ...state, ...action.profile  }
		}
		default: {
			return state
		}
	}
}

export default profile;