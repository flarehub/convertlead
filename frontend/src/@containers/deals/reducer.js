import {
    ADD_COMPANY_DEALS, CREATE_COMPANY_DEAL, FILTER_DEAL_CAMPAIGNS_BY_ID, FILTER_DEALS_BY_COMPANY,
    FILTER_DEALS_BY_ID,
    SEARCH_DEALS_BY_COMPANY, SORT_DEALS_BY,
    UPDATE_COMPANY_DEAL,
} from './actions';

const initState = {
    deals: [],
    selectBoxDeals: [],
    filters: {
        search: '',
        sortBy: 'name.asc',
        companyId: '',
        dealId: '',
        campaignId: '',
    },
};

function deals(state = initState, action) {
    switch (action.type) {
        case ADD_COMPANY_DEALS: {
            return {
                ...state,
                deals: [...action.deals],
            };
        }
        case CREATE_COMPANY_DEAL: {
            state.deals.push(action.deal);
            return {
                ...state,
            };
        }
        case UPDATE_COMPANY_DEAL: {
            state.deals.map(deal => (deal.id === action.deal.id ? {...deal, ...action.deal} : deal));
            return {
                ...state,
            };
        }
        case FILTER_DEALS_BY_COMPANY: {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    companyId: action.id,
                },
            };
        }
        case FILTER_DEAL_CAMPAIGNS_BY_ID: {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    campaignId: action.id,
                },
            };
        }
        case FILTER_DEALS_BY_ID: {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    dealId: action.id,
                },
            };
        }
        case SEARCH_DEALS_BY_COMPANY: {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    search: action.search,
                },
            };
        }
        case SORT_DEALS_BY: {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    sortBy: action.sortBy,
                },
            };
        }
        default: {
            return state;
        }
    }
}

export default deals;
