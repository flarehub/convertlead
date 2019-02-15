import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { BreadCrumbContainer, CompaniesContainer, DealsContainer } from '@containers';
import DealModal from '../@common/modals/deal';
import {
  Segment, Card, Header, Dimmer, Menu, Loader, Image, Form, Select, Input, Grid, Button
} from 'semantic-ui-react';

import * as moment from 'moment';
import styles from './index.scss';
import {DealFormContainer} from "../../@containers";

const companies = [
  { key: null, text: 'All companies', value: null },
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.resetBreadCrumbToDefault();
    this.props.getCompanyDeals();
    this.props.loadSelectBoxCompanies();
  }

  searchDealsByCompany = (event, data) => {
    this.props.searchDealCompaniesBy(data.value);
  }

  filterDealsByCompany = (event, data) => {
    this.props.filterDealsByCompany(data.value);
  };

	render() {
    const { deals } = this.props;
		return (
			<div className={styles.Dashboard}>
        <DealModal />
        <Segment attached='top'>
          <Grid columns={2}>
          <Grid.Column>
            <Header floated='left' as='h1'>Deals</Header>
            <Form.Field
              loading={!this.props.selectBoxCompanies.length}
              control={Select}
              options={[...companies, ...this.props.selectBoxCompanies]}
              label={{ children: 'Filter', htmlFor: 'form-companies-list' }}
              placeholder='All companies'
              search
              onChange={this.filterDealsByCompany}
              searchInput={{ id: 'form-companies-list' }}
            />
          </Grid.Column>
          <Grid.Column>
            <Menu secondary>
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Input icon='search' onChange={this.searchDealsByCompany} placeholder='Search...' />
                </Menu.Item>
                <Button color='teal'
                        content='New Deal'
                        onClick={this.props.loadForm.bind(this, { show: true })}
                        icon='add' labelPosition='left' />
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
          <Card.Group>
            {
              deals.map((deal, key) => (
                <Card key={key}>
                    <Card.Content>
                      <Link to={`/campaigns/${deal.id}`}>
                      <Card.Header>{deal.name}</Card.Header>
                      <Card.Meta>Started {moment(deal.created_at).format('DD/MM/YYYY')}</Card.Meta>
                      <Card.Description>
                        <Image avatar src={deal.company.avatar_path} size='medium' circular />
                        {deal.company.name}
                        </Card.Description>
                      </Link>
                      <Button basic compact onClick={this.props.loadForm.bind(this, { ...deal, companyId: deal.company.id, show: true })}>Edit</Button>
                    </Card.Content>
                </Card>
              ))
            }
          </Card.Group>
        </Segment>
			</div>
		);
	}
}
export default compose(BreadCrumbContainer, CompaniesContainer, DealsContainer, DealFormContainer)(Dashboard);