import api from "../../@services/api";
import {addCompanies} from "./actions";

export const loadCompanies = (page = 1, perPage = 10) => {
  return async (dispatch, getState) => {
    try {
      const response =
        await api.get(`/v1/agency/companies?per_page=${perPage}&current_page=${page}`);
      const { data, ...pagination } = response.data;
      await dispatch(addCompanies(data, pagination));
    } catch {
      // todo dispatch error
    }
  }
};