import {createSelector} from 'reselect';

const filterDeals = (state) => {
    const {deals, filters} = state;
    const dealsRes = deals.filter(deal => (!filters.companyId || deal.company.id === state.filters.companyId) && deal.deleted_at === null);

    return dealsRes.filter(deal => !filters.search || (deal.name.search(new RegExp(filters.search, 'i')) !== -1));
};

const filterDeletedDeals = (state) => {
    const {deals, filters} = state;
    const dealsRes = deals.filter(deal => (!filters.companyId || deal.company.id === state.filters.companyId) && deal.deleted_at !== null);

    return dealsRes.filter(deal => !filters.search || (deal.name.search(new RegExp(filters.search, 'i')) !== -1));
}

export const getDeals = createSelector(
    state => state.deals,
    filterDeals,
);

export const getDeletedDeals = createSelector(
    state => state.deals,
    filterDeletedDeals,
);


export const getSelectBoxDeals = createSelector(
    state => filterDeals(state.deals),
    deals => deals.map(company => ({
        key: company.id,
        value: company.id,
        text: company.name,
    })),
);


export const getSelectBoxDealCampaigns = createSelector(
    state => state.deals,
    (state) => {
        const {deals, filters} = state;
        const deal = deals.find(deal => deal.id === filters.dealId);
        if (deal) {
            return deal.campaigns && deal.campaigns.map(campaign => ({
                key: campaign.id,
                value: campaign.id,
                text: campaign.name,
            }));
        }
        return [];
    },
);

export const getSelectBoxDealCampaignAgents = createSelector(
    state => state.deals,
    (state) => {
        const {deals, filters} = state;
        const deal = deals.find(deal => deal.id === filters.dealId);
        if (deal) {
            const campaign = deal.campaigns && deal.campaigns.find(campaign => campaign.id === filters.campaignId);
            if (campaign) {
                return campaign.agents && campaign.agents.map(agent => ({
                    key: agent.id,
                    value: agent.id,
                    text: agent.name,
                }));
            }
        }

        return [];
    },
);
