import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { CompaniesContainer, BreadCrumbContainer, CompanyFormContainer } from '@containers';
import CompanyModal from '../@common/modals/company';
import * as R from 'ramda';
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
  Confirm,
} from 'semantic-ui-react';
import styles from './index.scss';

class Companies extends Component {
  state = {
    open: false,
    companyId: null,
  };

  getSort = field => {
    const fieldStatus = R.path(['query', 'sort', field], this.props);
    if (fieldStatus=== true) {
      return 'sort amount down';
    }
    if (fieldStatus === false) {
      return 'sort amount up';
    }
    return 'sort';
  }

  onSearch = (event) => {
    this.props.searchCompanies(event.target.value);
  }

  loadCompanies = (event, data) => {
    this.props.openCompaniesPage(data.activePage);
  }

  openConfirmModal = (open = true, companyId = null) => {
    this.setState({ open, companyId })
  }

  onConfirm = () => {
    this.setState({ open: false });
    this.props.deleteCompany(this.state.companyId);
  }

  onShowArch = () => {
    this.props.toggleShowDeleted();
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
      <div className={styles.Companies}>
      <CompanyModal />
      <Segment attached='top'>
        <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)} onConfirm={this.onConfirm} />
        <Grid columns={2}>
          <Grid.Column>
            <Header floated='left' as='h1'>Companies</Header>
            <Form.Field>
              <Checkbox label='Show Archived' toggle onChange={this.onShowArch} />
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Menu secondary>
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Input icon='search' onKeyUp={this.onSearch} placeholder='Search...' />
                </Menu.Item>
                <Button color='teal' onClick={this.props.loadForm.bind(this, { show: true })} content='New Company' icon='add' labelPosition='left' />
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
                                                  onClick={this.props.sort.bind(this, 'name')}/>
              </Table.HeaderCell>
              <Table.HeaderCell>Deals
                <Icon name={this.getSort('deals')}
                      onClick={this.props.sort.bind(this, 'deals')}/>
              </Table.HeaderCell>
              <Table.HeaderCell>Leads  <Icon name={this.getSort('leads')}
                                             onClick={this.props.sort.bind(this, 'leads')}/>
              </Table.HeaderCell>
              <Table.HeaderCell>Agents
                <Icon name={this.getSort('agents')}
                      onClick={this.props.sort.bind(this, 'agents')}/>
              </Table.HeaderCell>
              <Table.HeaderCell>Avg Response time
                <Icon name={this.getSort('avg_response')}
                      onClick={this.props.sort.bind(this, 'avg_response')}/>
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
                  <Table.Cell><Link to={`/companies/${company.id}`}>{company.name}</Link></Table.Cell>
                  <Table.Cell><Link to={`/companies/${company.id}/deals`}>{company.deals_count}</Link></Table.Cell>
                  <Table.Cell><Link to={`/companies/${company.id}/leads`} >{company.leads_count}</Link></Table.Cell>
                  <Table.Cell><Link to={`/companies/${company.id}/agents`}>{company.agents_count}</Link></Table.Cell>
                  <Table.Cell>{company.avg_lead_response || 0}</Table.Cell>
                  <Table.Cell>
                    {
                      !company.is_deleted
                      ?<Button.Group>
                        <Button onClick={this.props.loadForm.bind(this, { ...company, show: true })}><Icon name='pencil alternate' /></Button>
                        <Button><Icon name='lock' /></Button>
                        {/*<Button><Icon name='lock open' /></Button>*/}
                        <Button onClick={this.openConfirmModal.bind(this, true, company.id)}><Icon name='trash alternate outline'/></Button>
                      </Button.Group>
                      : null
                    }
                  </Table.Cell>
                </Table.Row>
              ))
            }

          </Table.Body>
        </Table>
      </Segment>
        <Segment textAlign='right' attached='bottom'>
          <Pagination onPageChange={this.loadCompanies}
                      defaultActivePage={pagination.current_page}
                      prevItem={null}
                      nextItem={null}
                      totalPages={pagination.last_page} />
        </Segment>
      </div>
    );
  }
}

export default compose(CompaniesContainer, CompanyFormContainer, BreadCrumbContainer)(Companies);