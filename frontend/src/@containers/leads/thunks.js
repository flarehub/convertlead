import * as actions from './actions';
import { hideLoader, showLoader } from '../loader/actions';
import { sendMessage } from '../messages/thunks';
import { api } from '../../@services';

export const loadLeads = () => async (dispatch, getState) => {
  dispatch(showLoader());
  try {
    const { query, pagination } = getState().leads;
    const response = await api.get('/v1/agency/leads', {
      params: {
        ...query.sort,
        search: query.search,
        showDeleted: (query.showDeleted ? query.showDeleted : null),
        per_page: pagination.per_page,
        current_page: (query.search ? 1 : pagination.current_page),
      },
    });
    const { data, ...rest } = response.data;

    dispatch(actions.loadLeads(data, rest));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
  dispatch(hideLoader());
};


export const addLead = (companyId, campaignId, lead) => (dispatch, getState) => {
  dispatch(actions.addLead(campaignId, companyId, lead));
};

export const updateLead = (id, lead) => (dispatch) => {
  dispatch();
};

export const deleteLead = (companyId, id) => async (dispatch) => {
  try {
    await api.delete(`/v1/agency/companies/${companyId}/leads/${id}`);
    await dispatch(loadLeads());
    dispatch(sendMessage('Successfully deleted'));
  } catch (e) {
    dispatch(sendMessage(e.message, true));
  }
};

export const filterLeads = filters => (dispatch) => {

};

export const searchLeads = search => async (dispatch) => {
  await dispatch(actions.searchLeads(search));
  await dispatch(loadLeads());
};

export const gotoPage = activePage => async (dispatch) => {
  await dispatch(actions.gotoPage(activePage));
  await dispatch(loadLeads());
};

export const toggleShowDeleted = () => async (dispatch) => {
  await dispatch(actions.toggleShowDeleted());
  await dispatch(loadLeads());
};

export const sortLeads = field => async (dispatch) => {
  await dispatch(actions.sortLeads(field));
  await dispatch(loadLeads());
};
