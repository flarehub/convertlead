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
  Grid,
  Menu,
} from 'semantic-ui-react';
import styles from './index.scss';
import EntityModal from "../@common/modals/enitity";

class Companies extends Component {
  state = {
    search: '',
    open: false,
    sort: {
      name: true,
      deals: null,
      leads: null,
      agents: null,
      avg_response: null,
    },
  };

  constructor(props) {
    super(props);
  }

  sort = (field) => {
    const state = {
      ...this.state,
      sort: {
        ...this.state.sort,
        [field]: (this.state.sort[field] === false ? null : !this.state.sort[field])
      }
    };
    this.setState(state);
    this.props.loadCompanies(
      this.props.pagination.current_page,
      this.props.pagination.per_page, state.search, state.sort);
  }

  getSort = (field) => {
    if (this.state.sort[field] === true) {
      return 'sort amount down';
    }
    if (this.state.sort[field] === false) {
      return 'sort amount up';
    }
    return 'sort';
  }

  onSearch = (event, data) => {
    this.setState({ search: data.value });
    this.props.loadCompanies(
      this.props.pagination.current_page,
      this.props.pagination.per_page, data.value, this.state.sort);
  }

  open = () => {
    this.setState({ open: true });
  }

  onSave = (data) => {
  }

  onClose = (data) => {
    this.setState({ open: false });
  }

  loadCompanies = (event, data) => {
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
    const { open, sort } = this.state;
    return (
      <Segment className={styles.Companies}>
        <EntityModal open={open} title='Company Create' onSave={this.onSave} onClose={this.onClose}/>
        <Grid columns={2}>
          <Grid.Column>
            <Header floated='left' as='h1'>Companies</Header>
            <Form.Field>
              <Checkbox label='Show Archived' />
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Menu secondary>
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Input icon='search' onChange={this.onSearch} placeholder='Search...' />
                </Menu.Item>
                <Button color='teal' onClick={this.open} content='New Company' icon='add' labelPosition='left' />
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Company name
                <Icon name={this.getSort('name')}
                                                  onClick={this.sort.bind(this, 'name')}/>
              </Table.HeaderCell>
              <Table.HeaderCell>Deals
                <Icon name={this.getSort('deals')}
                      onClick={this.sort.bind(this, 'deals')}/>
              </Table.HeaderCell>
              <Table.HeaderCell>Leads  <Icon name={this.getSort('leads')}
                                             onClick={this.sort.bind(this, 'leads')}/>
              </Table.HeaderCell>
              <Table.HeaderCell>Agents
                <Icon name={this.getSort('agents')}
                      onClick={this.sort.bind(this, 'agents')}/>
              </Table.HeaderCell>
              <Table.HeaderCell>Avg Response time
                <Icon name={this.getSort('avg_response')}
                      onClick={this.sort.bind(this, 'avg_response')}/>
              </Table.HeaderCell>
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
        <Segment textAlign='right'>
          <Pagination onPageChange={this.loadCompanies}
                      defaultActivePage={pagination.current_page}
                      prevItem={null}
                      nextItem={null}
                      totalPages={pagination.last_page} />
        </Segment>
      </Segment>
    );
  }
}

export default compose(CompaniesContainer, BreadCrumbContainer)(Companies);