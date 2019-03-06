import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { BreadCrumbContainer, AgentsContainer, AgentFormContainer } from '@containers';
import AgentModal from '../@common/modals/agent';
import * as moment from 'moment';
import {
  Button,
  Checkbox,
  Confirm,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Menu,
  Pagination,
  Segment,
  Table,
  Select,
} from 'semantic-ui-react';
import styles from './index.scss';
import Loader from '../loader';
import * as R from "ramda";
import { CompaniesContainer } from "@containers";

const companies = [
  { key: null, text: 'All companies', value: null },
];

class Agents extends Component {
  state = {
    open: false,
    agentId: null,
    companyId: null,
  };

  componentWillMount() {
    const companyId = +R.pathOr('', ['match', 'params', 'companyId'], this.props);
    this.props.addBreadCrumb({
      name: 'Agents',
      path: '/agents'
    });
    this.props.filterAgents({
      companyId
    });
    this.props.loadSelectBoxCompanies();
    this.setState({
      ...this.state,
      companyId: companyId
    })
  }

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

  onSearch = (event, data) => {
    this.props.search(data.value);
  }

  gotoPage = (event, data) => {
    this.props.gotoPage(data.activePage);
  }

  openConfirmModal = (open = true, agentId = null) => {
    this.setState({ open, agentId });
  }

  onConfirm = () => {
    this.setState({ open: false });
    this.props.delete(this.state.agentId);
  }

  onShowArch = () => {
    this.props.toggleShowDeleted();
  }

  onChangeCompany = (event, data) => {
    this.props.filterAgents({
      companyId: data.value
    });
  }

  render() {
    const agents = this.props.agents || [];
    const { pagination, query  } = this.props;
    const { companyId } = this.state;
    return (
      <div className={styles.Agents}>
        <AgentModal />
        <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)} onConfirm={this.onConfirm} />
        <Segment attached='top'>
          <Grid columns={2}>
            <Grid.Column>
              <Header floated='left' as='h1'>Agents</Header>
              <Form>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <Checkbox label='Show Archived' toggle onChange={this.onShowArch} />
                  </Form.Field>
                  <Form.Field
                    loading={!this.props.selectBoxCompanies.length}
                    control={Select}
                    options={[...companies, ...this.props.selectBoxCompanies]}
                    label={{ children: 'Filter', htmlFor: 'form-companies-list' }}
                    placeholder='All companies'
                    search
                    onChange={this.onChangeCompany}
                    defaultValue={companyId}
                    searchInput={{ id: 'form-companies-list' }}
                  />
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column>
              <Menu secondary>
                <Menu.Menu position='right'>
                  <Menu.Item>
                    <Input icon='search' onChange={this.onSearch} value={query.search || ''} placeholder='Search...' />
                  </Menu.Item>
                  <Button color='teal' onClick={this.props.loadForm.bind(this, { show: true })} content='New Agent' icon='add' labelPosition='left' />
                </Menu.Menu>
              </Menu>
            </Grid.Column>
          </Grid>
          <Segment basic>
            <Loader />
            <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name
                  <Icon name={this.getSort('name')}
                        onClick={this.props.sort.bind(this, 'name')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Companies</Table.HeaderCell>
                <Table.HeaderCell>Campaigns  <Icon name={this.getSort('campaigns')}
                                               onClick={this.props.sort.bind(this, 'campaigns')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Leads
                  <Icon name={this.getSort('leads')}
                        onClick={this.props.sort.bind(this, 'leads')}/>
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
                agents.map((agent, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Link to={`/agents/${agent.id}/profile`}>
                        {agent.name}
                      </Link>
                      <div>
                        Added {moment(agent.created_at).format('DD/MM/YYYY')}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {
                        agent.companies.map((company, key) =>  <div key={key}>
                          <Link to={`/companies/${company.id}/profile`}>
                            <Image avatar src={company.avatar_path} rounded size='mini' />
                            {company.name}
                          </Link>
                        </div>)
                      }

                    </Table.Cell>
                    {/*<Table.Cell>{<Link to={`/agents/${agent.id}/campaigns`}>{agent.campaigns_count || 0}</Link>}</Table.Cell>*/}
                    <Table.Cell>{agent.campaigns_count || 0}</Table.Cell>
                    <Table.Cell>{<Link to={`/agents/${agent.id}/leads`}>{agent.leads_count || 0}</Link>}</Table.Cell>
                    <Table.Cell>{agent.avg_lead_response || 0}</Table.Cell>
                    <Table.Cell>
                      {
                        !agent.is_deleted
                          ?<Button.Group>
                            <Button onClick={this.props.loadForm.bind(this, {...agent, show: true})} ><Icon name='pencil alternate' /></Button>
                            <Button onClick={this.openConfirmModal.bind(this, true, agent.id)}><Icon name='trash alternate outline'/></Button>
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
        </Segment>
        <Segment textAlign='right' attached='bottom'>
          <Pagination onPageChange={this.gotoPage}
                      defaultActivePage={pagination.current_page}
                      prevItem={null}
                      nextItem={null}
                      totalPages={pagination.last_page} />
        </Segment>
    </div>)
  }
}

export default compose(BreadCrumbContainer, CompaniesContainer, AgentsContainer, AgentFormContainer)(Agents);