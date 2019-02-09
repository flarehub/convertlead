import api from "../../@services/api";
import * as actions from "./actions";

export const deleteCompany = id => {
  return async (dispatch, getState) => {
    try {
      const response = await api.delete(`/v1/agency/companies/${id}`);
      const { pagination, query } = getState().companies;
      if (response.data) {
        await dispatch(loadCompanies(
          pagination.current_page,
          pagination.per_page,
          query.search,
          query.sort,
        ))
      }
    } catch (e) {
      console.error(e);
      // todo dispatch a message error
    }
  }
};

export const loadCompanies = (page = 1, perPage = 10, search = '', sort = {
  name: true,
  deals: null,
  leads: null,
  agents: null,
  avg_response: null,
}) => {
  return async (dispatch, getState) => {
    try {
      const response =
        await api.get('/v1/agency/companies', {
          params: {
            per_page: perPage,
            current_page: page,
            showDeleted: (getState().companies.query.showDeleted ? 1 : null),
            search,
            ...sort,
          }
        });
      const { data, ...pagination } = response.data;
      await dispatch(actions.addCompanies(data, pagination));
    } catch (e) {
      console.error(e);
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
    await dispatch(actions.sortCompanies(field));
    const { companies } = getState();
    dispatch(loadCompanies(
      companies.pagination.current_page,
      companies.pagination.per_page, companies.query.search,
      companies.query.sort)
    )
  }
};
export const toggleShowDeleted = () => {
  return async (dispatch, getState) => {
    await dispatch(actions.toggleShowDeleted());
    const { companies } = getState();
    dispatch(loadCompanies(
      companies.pagination.current_page,
      companies.pagination.per_page,
      companies.query.search,
      companies.query.sort)
    )
  }
};