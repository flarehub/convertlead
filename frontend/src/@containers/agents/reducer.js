import {
  ADD_AGENTS, FILTER_AGENTS, GOTO_PAGE, LOAD_SELECTBOX_AGENTS, OPEN_AGENT_MODAL, SEARCH_AGENTS, SHOW_DELETED_AGENTS,
  SORT_AGENTS,
} from './actions';

const initState = {
  agents: [],
  selectBoxAgents: [],
  pagination: {
    current_page: 1,
    per_page: 10,
    last_page: 1,
  },
  openModalStatus: false,
  query: {
    search: '',
    showDeleted: false,
    filters: {
      companyId: null,
    },
    sort: {
      name: true,
      campaigns: null,
      leads: null,
      avg_response: null,
    },
  },
};

const agents = (state = initState, action) => {
  switch (action.type) {
    case OPEN_AGENT_MODAL: {
      return {
        ...state,
        openModalStatus: action.open,
      };
    }
    case ADD_AGENTS: {
      return {
        ...state,
        agents: [...action.agents],
        pagination: action.pagination,
      };
    }
    case SEARCH_AGENTS: {
      return {
        ...state,
        query: {
          ...state.query,
          search: action.search,
        },
      };
    }
    case GOTO_PAGE: {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          current_page: action.activePage,
        },
      };
    }
    case SORT_AGENTS: {
      return {
        ...state,
        query: {
          ...state.query,
          sort: {
            ...state.query.sort,
            [action.field]: (state.query.sort[action.field] === false ? null : !state.query.sort[action.field]),
          },
        },
      };
    }
    case SHOW_DELETED_AGENTS: {
      return {
        ...state,
        query: {
          ...state.query,
          showDeleted: !state.query.showDeleted,
        },
      };
    }
    case LOAD_SELECTBOX_AGENTS: {
      return {
        ...state,
        selectBoxAgents: [ ...action.agents ]
      }
    }
    case FILTER_AGENTS: {
      return {
        ...state,
        query: {
          ...state.query,
          filters: {
            ...state.query.filters,
            ...action.filters,
          }
        }
      }
    }
    default: {
      return state;
    }
  }
};

export default agents;
