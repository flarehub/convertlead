import api from "../../@services/api";
import {addCompanies, sortCompanies} from "./actions";

export const loadCompanies = (page = 1, perPage = 10, search = '', sort = {
  name: true,
  deals: null,
  leads: null,
  agents: null,
  avg_response: null,
}) => {
  return async dispatch => {
    try {
      const response =
        await api.get('/v1/agency/companies', {
          params: {
            per_page: perPage,
            current_page: page,
            search,
            ...sort,
          }
        });
      const { data, ...pagination } = response.data;
      await dispatch(addCompanies(data, pagination));
    } catch {
      // todo dispatch error
    }
  }
};

export const openCompaniesPage = activePage => {
  return (dispatch, getState) => {
    const { companies } = getState();
    dispatch(loadCompanies(
      activePage,
      companies.pagination.per_page,
      companies.query.search,
      companies.query.sort)
    )
  };
};

export const searchCompanies = search => {
  return (dispatch, getState) => {
    const { companies } = getState();
    dispatch(loadCompanies(
      companies.pagination.current_page,
      companies.pagination.per_page, search,
      companies.query.sort)
    )
  }
};

export const onSortCompanies = field => {
  return async (dispatch, getState) => {
    await dispatch(sortCompanies(field));
    const { companies } = getState();
    dispatch(loadCompanies(
      companies.pagination.current_page,
      companies.pagination.per_page, companies.query.search,
      companies.query.sort)
    )
  }
};