import React, {Component} from 'react';
import {compose} from 'recompose';
import {CompaniesContainer, DealsContainer} from '@containers';
import DealModal from 'components/@common/modals/deal';
import Loader from 'components/loader';
import {
    Segment, Message, Confirm, Card, Header, Menu, Input, Grid, Button, Checkbox, Form, Select
} from 'semantic-ui-react';

import './index.scss';
import {DealFormContainer} from "@containers";
import * as R from "ramda";
import {Auth} from "@services";
import {CardContent} from "./card-content";

const companies = [
    {key: null, text: 'All companies', value: null},
];

class Dashboard extends Component {
    state = {
        open: false,
        companyId: '',
        dealId: '',
        showArchived: false,
        visible: true
    };

    componentWillMount() {
        const companyId = +R.pathOr('', ['companyId'], this.props);
        this.props.getCompanyDeals();

        this.props.filterDealsByDealId(null);
        this.props.filterDealCampaignsById(null);

        if (Auth.isAgency) {
            this.props.loadSelectBoxCompanies();
            this.props.filterDealsByCompany(companyId);
            this.setState({
                ...this.state,
                companyId
            })
        }
    }

    openConfirmModal = (open = true, companyId = '', dealId = '') => {
        this.setState({open, companyId, dealId})
    };

    onConfirm = () => {
        this.setState({open: false});
        this.props.deleteDeal(this.state.companyId, this.state.dealId);
    };


    searchDealsByCompany = (event, data) => {
        this.props.searchDealCompaniesBy(data.value);
    };

    filterDealsByCompany = (event, data) => {
        this.props.filterDealsByCompany(data.value);
    };

    onSearchChange = event => {
        this.props.loadSelectBoxCompanies(event.target.value);
    };

    onShowArch = () => {
        this.state.showArchived = !this.state.showArchived
        this.setState(this.state)
    };

    handleDismiss = () => {
        this.setState({
            ...this.state,
            visible: false,
        });
        setTimeout(()  => {
            this.setState({
                ...this.state,
                visible: true,
            });
        }, 24 * 60 * 60 * 1000);
    };

    render() {
        const {deals, deleted_deals, filters} = this.props;
        const { companyId, visible } = this.state;
        return (
            <div className='Dashboard'>
                {
                    visible
                        ?  <Message className='dash' onDismiss={this.handleDismiss}>
                        <Message.Header>
                            New to ConvertLead ?
                        </Message.Header>
                        <Message.Content>
                            <p>Click the button below to watch our video tutorials & quick startup guide .</p>
                            <a className="item" href="https://convertlead.com/docs-home/" target="_blank">Take me there</a>
                        </Message.Content>
                        </Message>
                        : null
                }
                <DealModal/>
                <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)}
                         onConfirm={this.onConfirm}/>
                <Segment attached='top'>
                    <Grid columns={2}>
                        <Grid.Column>
                            <Header floated='left' as='h1'>Campaigns</Header>
                            <Form.Field>
                                <Checkbox label='Show Archived' toggle onChange={this.onShowArch}/>
                            </Form.Field>
                            {
                                Auth.isAgency ?
                                    <Form.Field
                                        loading={!this.props.selectBoxCompanies}
                                        control={Select}
                                        options={[...companies, ...this.props.selectBoxCompanies]}
                                        label={{ children: 'Filter', htmlFor: 'form-companies-list' }}
                                        placeholder='All companies'
                                        search
                                        onChange={this.filterDealsByCompany}
                                        defaultValue={companyId || null}
                                        onSearchChange={this.onSearchChange}
                                        searchInput={{ id: 'form-companies-list' }}
                                    />
                                    : null
                            }
                        </Grid.Column>
                        <Grid.Column>
                            <Menu secondary>
                                <Menu.Menu position='right'>
                                    <Menu.Item>
                                        <Input icon='search' onChange={this.searchDealsByCompany} value={filters.search}
                                               placeholder='Search...'/>
                                    </Menu.Item>
                                    <Button color='teal'
                                            content='New Campaign'
                                            onClick={this.props.loadForm.bind(this, {show: true})}/>
                                </Menu.Menu>
                            </Menu>
                        </Grid.Column>
                    </Grid>
                    <Segment basic>
                        <Loader/>
                        <div className='deals-active-container'>
                            <label className='deals-active'>Active <span>{deals.length}</span></label>
                        </div>
                        {
                            deals.length === 0 ?
                                <div className="empty-deal-wrapper">
                                    Welcome! Looks like you haven’t created a deal yet. Once you create one, you’ll see
                                    it here.
                                </div>
                                :
                                <Card.Group>
                                    {
                                        deals.map((deal, key) => (
                                            <Card key={key}>
                                                <Card.Content>
                                                    {
                                                        Auth.isAgency
                                                            ? <CardContent deal={deal} company={deal.company}
                                                                           link={`/companies/${deal.company.id}/deals/${deal.id}/campaigns`}/>
                                                            : <CardContent deal={deal} company={deal.agency}
                                                                           link={`/deals/${deal.id}/campaigns`}/>
                                                    }
                                                    <Button.Group basic size='small'>
                                                        <Button onClick={this.props.loadForm.bind(this, {
                                                            ...deal,
                                                            companyId: deal.company.id,
                                                            show: true
                                                        })}>Edit</Button>
                                                        <Button icon='trash alternate outline'
                                                                onClick={this.openConfirmModal.bind(this, true, deal.company.id, deal.id)}/>
                                                    </Button.Group>
                                                </Card.Content>
                                            </Card>
                                        ))
                                    }
                                </Card.Group>
                        }

                    </Segment>

                    <Segment basic style={{display: this.state.showArchived ? 'block' : 'none'}}>
                        <div className='deals-active-container archieved'>
                            <label className='deals-active'>Archieved <span>{deleted_deals.length}</span></label>
                        </div>
                        {
                            deleted_deals.length === 0 ?
                                <div className='deals-active-container'>
                                    <p>When you achieve a deal, you’ll see them here. <a href="">Learn more</a></p>
                                </div>
                                :
                                <Card.Group>
                                    {
                                        deleted_deals.map((deal, key) => (
                                            <Card key={key}>
                                                <Card.Content>
                                                    {
                                                        Auth.isAgency
                                                            ? <CardContent deal={deal} company={deal.company}
                                                                           link={`/companies/${deal.company.id}/deals/${deal.id}/campaigns`}/>
                                                            : <CardContent deal={deal} company={deal.agency}
                                                                           link={`/deals/${deal.id}/campaigns`}/>
                                                    }
                                                </Card.Content>
                                            </Card>
                                        ))
                                    }
                                </Card.Group>
                        }

                    </Segment>

                </Segment>
            </div>

        );
    }
}

export default compose(CompaniesContainer, DealsContainer, DealFormContainer)(Dashboard) ;