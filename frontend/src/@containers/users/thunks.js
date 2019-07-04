import {sendMessage} from "../messages/thunks";
import { api } from "@services";
import * as actions from './actions';

export const loadUsers = () => async (dispatch, getState) => {
  try {
    const { query } = getState().users;
    const response = await api.get(`/v1/admin/users`, { params: query });
    const { data, ...pagination } = response.data;
    dispatch(actions.loadUsers(data, pagination));

  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const filterUsers = filter => async dispatch => {
  try {
    await dispatch(actions.filterUsers(filter));
    dispatch(loadUsers());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const onSort = field => async dispatch => {
  await dispatch(actions.sortUsers(field));
  dispatch(loadUsers());
};

export const gotoUserPage = activePage => async dispatch => {
  await dispatch(actions.gotoUserPage(activePage));
  await dispatch(loadUsers());
};

export const searchUsers = search => async dispatch => {
  await dispatch(actions.searchUsers(search));
  await dispatch(loadUsers());
};
