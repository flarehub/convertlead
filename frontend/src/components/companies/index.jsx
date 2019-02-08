import React, { Component } from 'react';
import { compose } from 'recompose';
import { CompaniesContainer, BreadCrumbContainer } from '@containers';

import {
  Table,
  Segment,
  Pagination,
  Image,
  Button,
  Checkbox,
  Header,
  Form,
  Input,
  Icon,
} from 'semantic-ui-react';
import styles from './index.scss';

class Companies extends Component {
  loadCompanies = (event, data) => {
    console.log(data, data.activePage);
    this.props.loadCompanies(data.activePage);
  }
  componentWillMount() {
    this.props.addBreadCrumb({
      name: 'Companies',
      path: '/companies',
      active: true,
    }, true);
    this.props.loadCompanies();
  }
  render() {
    const companies  = this.props.companies || [];
    const { pagination  } = this.props;
    return (
      <Segment className={styles.Companies}>
        <Segment.Group horizontal>
          <Segment floated='left'>
            <Header floated='left' as='h1'>Companies</Header>
            <Form.Field>
              <Checkbox label='Show Archived' />
            </Form.Field>
          </Segment>
          <Segment floated='right'>
            <Form.Field
              width={1}
              id='search'
              control={Input}
              placeholder='Search'
            />
            <Button primary>
              <Icon name='plus circle' /> New Company
            </Button>
          </Segment>
        </Segment.Group>
        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Company name</Table.HeaderCell>
              <Table.HeaderCell>Deals</Table.HeaderCell>
              <Table.HeaderCell>Leads</Table.HeaderCell>
              <Table.HeaderCell>Agents</Table.HeaderCell>
              <Table.HeaderCell>Avg Response time</Table.HeaderCell>
              <Table.HeaderCell>Edit/Access/Archieve</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              companies.map((company, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Image avatar src={company.avatar_path} rounded size='mini' />
                  </Table.Cell>
                  <Table.Cell>{company.name}</Table.Cell>
                  <Table.Cell>{company.deals_count}</Table.Cell>
                  <Table.Cell>{company.leads_count}</Table.Cell>
                  <Table.Cell>{company.agents_count}</Table.Cell>
                  <Table.Cell>{company.avg_lead_response || 0}</Table.Cell>
                  <Table.Cell>
                    <Button.Group>
                      <Button><Icon name='pencil alternate' /></Button>
                      <Button><Icon name='lock' /></Button>
                      {/*<Button><Icon name='lock open' /></Button>*/}
                      <Button><Icon name='trash alternate outline'/></Button>
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>
              ))
            }

          </Table.Body>
        </Table>
        <Pagination
          onPageChange={this.loadCompanies}
          prevItem={null}
          nextItem={null}
          defaultActivePage={pagination.current_page}
          totalPages={pagination.last_page} />
      </Segment>
    );
  }
}

export default compose(CompaniesContainer, BreadCrumbContainer)(Companies);