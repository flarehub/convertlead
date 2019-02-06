import { api } from "../../@services";
import {addCompanyDeals} from "./actions";

export const getCompanyDeals = (currentPage = 1, perPage = 2000) => {
  return async (dispatch, getState) => {
    const { data } = await api.get(`/v1/agency/deals`, { params: { per_page: perPage, current_page: currentPage } });
    await dispatch(addCompanyDeals(data.data))
  }
};
