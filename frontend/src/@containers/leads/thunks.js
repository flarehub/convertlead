import * as actions from './actions';
import {hideLoader, showLoader} from '../loader/actions';
import {sendMessage} from '../messages/thunks';
import {Auth} from '@services';
import {deleteAgencyCompanyLead, deleteCompanyLead, fetchLeads} from "./api";

export const loadLeads = () => async (dispatch, getState) => {
    dispatch(showLoader());
    try {
        const {query, pagination} = getState().leads;

        const response = await fetchLeads({
            ...query.filters,
            ...query.sort,
            search: query.search,
            showDeleted: (query.showDeleted ? query.showDeleted : null),
            per_page: pagination.per_page,
            current_page: pagination.current_page,
        });

        const {data, ...rest} = response.data;
        console.log("resoponse.data====>", response.data);
        dispatch(actions.loadLeads(data, rest));
    } catch (e) {
        dispatch(sendMessage(e.message, true));
    }
    dispatch(hideLoader());
};

export const deleteLead = (companyId, id) => async (dispatch) => {
    try {
        if (Auth.isAgency) {
            await deleteAgencyCompanyLead(companyId, id);
        } else {
            await deleteCompanyLead(id);
        }
        await dispatch(loadLeads());
        dispatch(sendMessage('Successfully deleted'));
    } catch (e) {
        dispatch(sendMessage(e.message, true));
    }
};

export const filterLeads = filters => async (dispatch) => {
    await dispatch(actions.filterLeads(filters));
    await dispatch(loadLeads());
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


export const loadAgentLeads = () => async (dispatch, getState) => {
    dispatch(showLoader());
    try {
        const {query, pagination, agentLeadStatuses} = getState().leads;

        const response = await fetchLeads({
            statuses: agentLeadStatuses.join(','),
            search: query.search,
            per_page: 100,
            current_page: pagination.current_page,
            startDate: query.filters.startDate,
            endDate: query.filters.endDate
        });

        const {data, ...rest} = response.data.leads;
        const {new_leads_count} = response.data;

        dispatch(actions.agentLoadLeads(data, rest));
        dispatch(actions.agentNewLeadsCount(new_leads_count));
    } catch (e) {
        dispatch(sendMessage(e.message, true));
    }
    dispatch(hideLoader());
};

export const searchAgentLeads = search => async dispatch => {
    await dispatch(actions.agentSearchLeads(search));
    await dispatch(loadAgentLeads());
};

export const filterAgentLeads = filters => async dispatch => {
    await dispatch(actions.filterLeads(filters));
    await dispatch(loadAgentLeads());
};

export const agentLeadsByStatuses = statuses => async dispatch => {
    await dispatch(actions.agentResetLeads());
    await dispatch(actions.agentLoadLeadsStatuses(statuses));
    await dispatch(actions.gotoPage(1));
    await dispatch(loadAgentLeads());
};

export const scrollToPage = page => async (dispatch) => {
    await dispatch(actions.gotoPage(page));
    await dispatch(loadAgentLeads());
};