import api from "../../@services/api";
import {addCompanies} from "./actions";

export const loadCompanies = (page = 1, perPage = 10, search = '', sort = {
  name: true,
  deals: null,
  leads: null,
  agents: null,
  avg_response: null,
}) => {
  return async (dispatch, getState) => {
    console.log(sort);
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