import {
  ADD_AGENTS, FILTER_AGENTS, GOTO_PAGE, LOAD_AGENT_DATA, LOAD_AGENT_LEADS_GRAPH, LOAD_SELECTBOX_AGENTS,
  OPEN_AGENT_MODAL, SEARCH_AGENTS,
  SHOW_DELETED_AGENTS,
  SORT_AGENTS,
} from './actions';

const initState = {
  agents: [],
  agent: {
    id: '',
    name: '',
  },
  averageResponseTime: '',
  graphContactedLeadsAverage: {
    type: 'line',
    data: {
      labels: ["date x", "date y", "date y", "date y", "date y"],
      datasets: [
        {
          label: '15 min (0-15)',
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: ['rgba(0, 0, 0, 0)'],
          borderColor: ['#21ba45'],
          borderWidth: 2
        },
        {
          label: '30 min (15-30)',
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: ['rgba(0, 0, 0, 0)'],
          borderColor: ['#f2711c'],
          borderWidth: 2
        },
        {
          label: '2 hrs (30-2)',
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: ['rgba(0, 0, 0, 0)'],
          borderColor: ['#2cb3c8'],
          borderWidth: 2
        },
        {
          label: '12 hrs (2-12)',
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: ['rgba(0, 0, 0, 0)'],
          borderColor: ['#6435c9'],
          borderWidth: 2
        },
        {
          label: '12 hrs + Missed leads',
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: ['rgba(0, 0, 0, 0)'],
          borderColor: ['#db2828'],
          borderWidth: 2
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  },
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
    case LOAD_AGENT_DATA: {
      return {
        ...state,
        agent: action.agent,
      }
    }
    case LOAD_AGENT_LEADS_GRAPH: {
      return {
        ...state,
        averageResponseTime: action.graphData.avg_response_time,
        graphContactedLeadsAverage: {
          ...state.graphContactedLeadsAverage,
          data: {
            ...action.graphData
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
