import {CHANGE_PASSWORD_RESET_FORM, CHANGE_PROFILE_FORM, LOAD_PROFILE_FORM, UPDATE_USER_PROFILE} from './actions';

const initialState = {
  profile: {
    id: null,
    name: null,
    email: null,
    phone: null,
    avatar_path: null,
    role: null,
    permissions: [],
  },
  profileForm: {
    id: null,
    name: '',
    email: '',
    phone: '',
    avatar: '',
  },
  passwordResetForm: {
    password: '',
    password_confirmation: '',
  }
};

function profile(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_PROFILE: {
      return {
        ...state,
        profile: action.profile
      };
    }
    case LOAD_PROFILE_FORM: {
      return {
        ...state,
        profileForm: action.profile
      };
    }
    case CHANGE_PROFILE_FORM: {
      return {
        ...state,
        profileForm: {
          ...state.profileForm,
          ...action.profile,
        }
      };
    }
    case CHANGE_PASSWORD_RESET_FORM: {
      return {
        ...state,
        passwordResetForm: {
          ...state.passwordResetForm,
          ...action.passwordResetForm
        }
      }
    }
    default: {
      return state;
    }
  }
}

export default profile;
