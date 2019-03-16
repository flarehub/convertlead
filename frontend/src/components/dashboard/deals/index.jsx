import React, { Component } from 'react';
import { compose } from 'recompose';
import { CompaniesContainer, DealsContainer } from '@containers';
import DealModal from 'components/@common/modals/deal';
import Loader from 'components/loader';
import {
  Segment, Confirm, Card, Header, Menu, Form, Select, Input, Grid, Button
} from 'semantic-ui-react';

import './index.scss';
import {DealFormContainer} from "@containers";
import * as R from "ramda";
import { Auth } from "@services";
import {CardContent} from "./card-content";

const companies = [
  { key: null, text: 'All companies', value: null },
];

class Dashboard extends Component {
  state = {
    open: false,
    companyId: '',
    dealId: '',
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
    this.setState({ open, companyId, dealId })
  };

  onConfirm = () => {
    this.setState({ open: false });
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

	render() {
    const { deals, filters } = this.props;
    const { companyId } = this.state;
		return (
			<div className='Dashboard'>
        <DealModal />
        <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)} onConfirm={this.onConfirm} />
        <Segment attached='top'>
          <Grid columns={2}>
          <Grid.Column>
            <Header floated='left' as='h1'>Deals</Header>
            {
              Auth.isAgency ?  <Form.Field
                loading={!this.props.selectBoxCompanies.length}
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
                  <Input icon='search' onChange={this.searchDealsByCompany} value={filters.search} placeholder='Search...' />
                </Menu.Item>
                <Button color='teal'
                        content='New Deal'
                        onClick={this.props.loadForm.bind(this, { show: true })}
                        s/>
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
          <Segment basic>
            <Loader />
            <div className='deals-active-container'>
              <label className='deals-active'>Active <span>{deals.length}</span></label>
            </div>
            <Card.Group>
              {
                deals.map((deal, key) => (
                  <Card key={key}>
                      <Card.Content>
                        {
                          Auth.isAgency
                            ? <CardContent deal={deal} company={deal.company} link={`/companies/${deal.company.id}/deals/${deal.id}/campaigns`} />
                            : <CardContent deal={deal} company={deal.agency} link={`/deals/${deal.id}/campaigns`} />
                        }
                        <Button.Group basic size='small'>
                          <Button onClick={this.props.loadForm.bind(this, { ...deal, companyId: deal.company.id, show: true })}>Edit</Button>
                          <Button icon='trash alternate outline' onClick={this.openConfirmModal.bind(this, true, deal.company.id, deal.id)}  />
                        </Button.Group>
                      </Card.Content>
                  </Card>
                ))
              }
            </Card.Group>
          </Segment>
          
           <Segment basic>
                      <div className='deals-active-container archieved'>
              <label className='deals-active'>Archieved <span>{deals.length}</span></label>
              <p>When you delete/archieve deals, they'll show up here for easy access. <a href="">Learn more</a></p>
            </div>
            </Segment>
        </Segment>
			</div>
		);
	}
}
export default compose(CompaniesContainer, DealsContainer, DealFormContainer)(Dashboard);