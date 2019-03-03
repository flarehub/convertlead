import api from '../../@services/api';
import * as actions from './actions';
import { hideLoader, showLoader } from '../loader/actions';
import { sendMessage } from '../messages/thunks';

export const deleteCompany = id => async (dispatch, getState) => {
  try {
    dispatch(showLoader());
    const response = await api.delete(`/v1/agency/companies/${id}`);
    const { pagination, query } = getState().companies;
    if (response.data) {
      await dispatch(loadCompanies(
        pagination.current_page,
        pagination.per_page,
        query.search,
        query.sort,
      ));
    }
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
  dispatch(hideLoader());
};

export const updateLockStatusCompany = form => async (dispatch) => {
  try {
    await api.patch(`/v1/agency/companies/${form.id}/lock-status`, form);
    dispatch(sendMessage('Successfully saved'));
    await dispatch(loadCompanies());
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};


export const loadCompanies = (page = 1, perPage = 10, search = '', sort = {
  name: true,
  deals: null,
  leads: null,
  agents: null,
  avg_response: null,
}) => async (dispatch, getState) => {
  try {
    dispatch(showLoader());
    const response = await api.get('/v1/agency/companies', {
      params: {
        per_page: perPage,
        current_page: page,
        showDeleted: (getState().companies.query.showDeleted ? 1 : null),
        search,
        ...sort,
      },
    });
    const { data, ...pagination } = response.data;
    await dispatch(actions.addCompanies(data, pagination));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
  dispatch(hideLoader());
};

export const openCompaniesPage = activePage => (dispatch, getState) => {
  const { companies } = getState();
  dispatch(loadCompanies(
    activePage,
    companies.pagination.per_page,
    companies.query.search,
    companies.query.sort,
  ));
};

export const searchCompanies = search => (dispatch, getState) => {
  const { companies } = getState();
  dispatch(loadCompanies(
    companies.pagination.current_page,
    companies.pagination.per_page, search,
    companies.query.sort,
  ));
};

export const loadSelectBoxCompanies = search => async (dispatch, getState) => {
  try {
    const response = await api.get('/v1/agency/companies', {
      params: {
        search: search || null,
        per_page: 10000,
      },
    });
    const { data } = response.data;
    dispatch(actions.addSelectBoxCompanies(data));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const onSortCompanies = field => async (dispatch, getState) => {
  await dispatch(actions.sortCompanies(field));
  const { companies } = getState();
  dispatch(loadCompanies(
    companies.pagination.current_page,
    companies.pagination.per_page, companies.query.search,
    companies.query.sort,
  ));
};
export const toggleShowDeleted = () => async (dispatch, getState) => {
  await dispatch(actions.toggleShowDeleted());
  const { companies } = getState();
  dispatch(loadCompanies(
    companies.pagination.current_page,
    companies.pagination.per_page,
    companies.query.search,
    companies.query.sort,
  ));
};

export const getCompanyBy = id => async dispatch => {
  try {
    const response = await api.get(`/v1/agency/companies/${id}`);
    actions.loadCompany(response.data);
  } catch (e) {
    dispatch(sendMessage(e.message, true))
  }
};