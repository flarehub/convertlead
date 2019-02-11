import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { BreadCrumbContainer, DealsContainer } from '@containers';
import {
  Segment, Card, Header, Dimmer, Menu, Loader, Image, Form, Select, Input, Grid, Button, Icon
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
        <Segment attached='top'>
          <Grid columns={2}>
          <Grid.Column>
            <Header floated='left' as='h1'>Deals</Header>
            <Form.Field
              control={Select}
              options={genderOptions}
              label={{ children: 'Filter', htmlFor: 'form-companies-list' }}
              placeholder='All companies'
              searchInput={{ id: 'form-select-control-gender' }}
            />
          </Grid.Column>
          <Grid.Column>
            <Menu secondary>
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Input icon='search' placeholder='Search...' />
                </Menu.Item>
                <Button color='teal' content='New Deal' icon='add' labelPosition='left' />
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
          <Dimmer active={!this.state.ready} inverted>
            <Loader size='medium'>Loading</Loader>
          </Dimmer>
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
                      <Button basic compact>Edit</Button>
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