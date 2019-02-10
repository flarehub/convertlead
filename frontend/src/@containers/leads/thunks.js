import * as actions from './actions';
import {hideLoader, showLoader} from "../loader/actions";
import {sendMessage} from "../messages/actions";
import {api} from "../../@services";

export const loadLeads = () => {
  return async (dispatch, getState) => {
    dispatch(showLoader());
    try {
      const response = api.get('/v1/agency/leads');
      const { data, ...pagination } = response.data;

      dispatch(actions.loadLeads(data, pagination))

    } catch (e) {
      dispatch(sendMessage(e.message, true))
    }
    dispatch(hideLoader());
  };
};


export const addLead = (companyId, campaignId, lead) => {
  return (dispatch, getState) => {
    dispatch(actions.addLead(campaignId, companyId, lead))
  };
};

export const updateLead = (id, lead) => {
  return dispatch => {
    dispatch()
  };
};

export const removeLead = id => {
  return dispatch => {

  };
};

export const filterLeads = filters => {
  return dispatch => {

  };
};

export const searchLeads = search => {
  return dispatch => {

  };
};

export const gotoPage = activePage => {
  return dispatch => {

  };
};

export const toggleShowDeleted = () => {
  return dispatch => {

  };
};

export const sortLeads = field => {
  return dispatch => {
  };
};
