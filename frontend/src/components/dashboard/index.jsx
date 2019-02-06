import React, { Component } from 'react';
import { compose } from 'recompose';
import { BreadCrumbContainer, DealsContainer } from '@containers';
import {
  Segment, Card, Header, Dimmer, Loader, Image, Form, Select, Input, Grid, Button, Icon
} from 'semantic-ui-react';
import * as moment from 'moment';

import styles from './index.scss';

const genderOptions = [
  { key: 'all', text: 'All companies', value: 'all' },
  { key: 'coca', text: 'Coca', value: 'coca' },
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
  }

  componentWillMount() {
    this.props.resetBreadCrumbToDefault();
    this.props.getCompanyDeals();
    this.setState({
      ready: false
    })
  }

  componentDidMount() {
    this.setState({
      ready: true
    })
  }

	render() {
    const { deals } = this.props;
		return (
			<div className={styles.Dashboard}>
        <Segment.Group horizontal>
          <Segment floated='left'>
            <Header floated='left' as='h1'>Deals</Header>
            <Form.Field
              control={Select}
              options={genderOptions}
              label={{ children: 'Filter', htmlFor: 'form-companies-list' }}
              placeholder='All companies'
              searchInput={{ id: 'form-select-control-gender' }}
            />
          </Segment>
          <Segment floated='right'>
            <Form.Field
              width={1}
              id='search'
              control={Input}
              placeholder='Search'
            />
            <Button primary>
              <Icon name='plus circle' /> New Deal
            </Button>
          </Segment>
        </Segment.Group>
        <Segment>
            <Dimmer active={!this.state.ready} inverted>
              <Loader size='medium'>Loading</Loader>
            </Dimmer>
            <Card.Group>
              {
                deals.map((deal, key) => (
                  <Card key={key}>
                    <Card.Content>
                      <Card.Header>{deal.name}</Card.Header>
                      <Card.Meta>Started {moment(deal.created_at).format('DD/MM/YYYY')}</Card.Meta>
                      <Card.Description>
                        <Image avatar src={deal.company.avatar_path} size='medium' circular />
                        {deal.company.name}</Card.Description>
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
export default compose(BreadCrumbContainer, DealsContainer)(Dashboard);