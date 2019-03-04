import {
  ADD_COMPANIES, ADD_SELECT_BOX_COMPANIES, LOAD_COMPANY, LOAD_COMPANY_GRAPH_CONTACTED_LEADS_AVERAGE, OPEN_COMPANY_MODAL,
  SORT_COMPANIES,
  TOGGLE_SHOW_DELETED,
} from './actions';

const initState = {
  company: {},
  companies: [],
  selectBoxCompanies: [],
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
  pagination: {
    current_page: 1,
    per_page: 10,
    last_page: 1,
  },
  openModal: false,
  query: {
    search: '',
    showDeleted: false,
    sort: {
      name: true,
      deals: null,
      leads: null,
      agents: null,
      avg_response: null,
    },
  },
};

const companies = (state = initState, action) => {
  switch (action.type) {
    case ADD_COMPANIES: {
      return {
        ...state,
        companies: [...action.companies],
        pagination: action.pagination,
        query: {
          ...state.query,
          search: (action.search ? action.search : ''),
        },
      };
    }
    case SORT_COMPANIES: {
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
    case OPEN_COMPANY_MODAL: {
      return {
        ...state,
        openModal: action.open,
      };
    }
    case TOGGLE_SHOW_DELETED: {
      return {
        ...state,
        query: {
          ...state.query,
          showDeleted: !state.query.showDeleted,
        },
      };
    }
    case ADD_SELECT_BOX_COMPANIES: {
      return {
        ...state,
        selectBoxCompanies: [...action.companies],
      };
    }
    case LOAD_COMPANY: {
      return {
        ...state,
        company: action.company
      }
    }
    case LOAD_COMPANY_GRAPH_CONTACTED_LEADS_AVERAGE: {
      console.log('well', action.graphData);
      return {
        ...state,
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

export default companies;
