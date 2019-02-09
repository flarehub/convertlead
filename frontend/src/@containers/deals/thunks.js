import { api } from "../../@services";
import {addCompanyDeals} from "./actions";
import {hideLoader, showLoader} from "../loader/actions";
import {sendMessage} from "../messages/actions";

export const getCompanyDeals = (currentPage = 1, perPage = 2000) => {
  return async (dispatch, getState) => {
    try {
      dispatch(showLoader());
      const { data } = await api.get(`/v1/agency/deals`, { params: { per_page: perPage, current_page: currentPage } });
      await dispatch(addCompanyDeals(data.data))
    } catch (e) {
      dispatch(sendMessage(e.message, true))
    }
    dispatch(hideLoader());
  }
};