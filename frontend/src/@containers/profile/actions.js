export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';

export const updateUserProfile = profile => ({
  type: UPDATE_USER_PROFILE,
  profile,
});
