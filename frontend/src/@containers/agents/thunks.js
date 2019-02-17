import * as actions from './actions';
import { api } from '../../@services';
import { hideLoader, showLoader } from '../loader/actions';
import { sendMessage } from '../messages/thunks';

export const loadAgents = () => async (dispath, getState) => {
  try {
    dispath(showLoader());
    const { pagination, query } = getState().agents;
    const response = await api.get('/v1/agency/agents', {
      params: {
        ...query.sort,
        showDeleted: (query.showDeleted ? true : null),
        search: query.search,
        current_page: pagination.current_page,
        per_page: pagination.per_page,
      },
    });
    const { data, ...rest } = response.data;
    dispath(actions.addAgents(data, rest));
  } catch (e) {
    dispath(sendMessage(e.message, true));
  }
  dispath(hideLoader());
};

export const createAgent = agent => (dispath, getState) => {
  dispath(loadAgents());
};

export const editAgent = (id, agent) => (dispath, getState) => {
  dispath(actions.editAgent(id, agent));
};

export const deleteAgent = (companyId, id) => async (dispath, getState) => {
  try {
    await api.delete(`/v1/agency/companies/${companyId}/agents/${id}`);
    dispath(loadAgents());
  } catch (e) {
    // todo add message error
  }
};

export const filterAgents = filters => async (dispath, getState) => {
  await dispath(actions.filterAgents(filters));
  await dispath(loadAgents());
};

export const sortAgents = field => async (dispath, getState) => {
  await dispath(actions.sortAgents(field));
  await dispath(loadAgents());
};

export const searchAgents = search => async (dispath, getState) => {
  await dispath(actions.searchAgents(search));
  await dispath(loadAgents());
};

export const gotoPage = activePage => async (dispath, getState) => {
  await dispath(actions.gotoPage(activePage));
  await dispath(loadAgents());
};

export const toggleShowDeleted = () => async (dispath, getState) => {
  await dispath(actions.toggleShowDeleted());
  await dispath(loadAgents());
};
