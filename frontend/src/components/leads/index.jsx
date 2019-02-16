import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import * as moment from 'moment';
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
import { BreadCrumbContainer, LeadsContainer } from '@containers';
import Loader from '../loader';
import * as R from "ramda";

class Leads extends Component {

  constructor(props) {
    super(props);
    this.props.loadLeads();
  }

  state = {
    open: false,
    leadId: null,
    companyId: null,
  };

  getSort = field => {
    const fieldStatus = R.path(['query', 'sort', field], this.props);
    if (fieldStatus === true) {
      return 'sort amount down';
    }
    if (fieldStatus === false) {
      return 'sort amount up';
    }
    return 'sort';
  }

  onSearch = (event, data) => {
    this.props.searchLeads(data.value);
  }

  gotoPage = (event, data) => {
    this.props.gotoPage(data.activePage);
  }

  openConfirmModal = (open = true, companyId, leadId = null) => {
    this.setState({open, companyId, leadId})
  }

  onConfirm = () => {
    this.setState({open: false});
    this.props.delete(this.state.companyId, this.state.leadId);
  }

  onShowArch = () => {
    this.props.toggleShowDeleted();
  }

  componentWillMount() {
    this.props.addBreadCrumb({
      name: 'Leads',
      path: '/leads'
    });
  }

  render() {
    const leads = this.props.leads || [];
    const {pagination, statuses, openModalStatus} = this.props;

    return (
      <div className={styles.Agents}>
        <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)} onConfirm={this.onConfirm}/>
        <Segment attached='top'>
          <Grid columns={2}>
            <Grid.Column>
              <Header floated='left' as='h1'>Leads</Header>
              <Form.Field>
                <Checkbox label='Show Archived' toggle onChange={this.onShowArch}/>
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Menu secondary>
                <Menu.Menu position='right'>
                  <Menu.Item>
                    <Input icon='search' onChange={this.onSearch} placeholder='Search...'/>
                  </Menu.Item>
                  <Button color='teal' onClick={this.props.openModal.bind(this, true)} content='New Lead' icon='add'
                          labelPosition='left'/>
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
                <Table.HeaderCell>Assigned to</Table.HeaderCell>
                <Table.HeaderCell>E-mail Address<Icon name={this.getSort('email')}
                                                  onClick={this.props.sort.bind(this, 'email')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Phone Number</Table.HeaderCell>
                <Table.HeaderCell>Company
                  <Icon name={this.getSort('company')}
                        onClick={this.props.sort.bind(this, 'company')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Source
                  <Icon name={this.getSort('campaign')}
                        onClick={this.props.sort.bind(this, 'campaign')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Edit/Access/Archieve</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                leads.map((lead, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Button circular color={statuses[lead.status].color}>{statuses[lead.status].icon}</Button>
                      {lead.fullname}
                      <div>
                        Added {moment(lead.created_at).format('DD/MM/YYYY')}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{
                      lead.agents && lead.agents.map((agent, key) => <Link key={key} to={`/agents/${agent.id}`}>{agent.name}</Link>)
                    }</Table.Cell>
                    <Table.Cell>{lead.email}</Table.Cell>
                    <Table.Cell>{lead.phone}</Table.Cell>
                    <Table.Cell>
                      {
                        lead.company
                          ? <div>
                            <Link to={`/companies/${lead.company.id}`}>
                              <Image avatar src={lead.company.avatar_path} rounded size='mini'/>
                              {lead.company.name}
                            </Link>
                          </div>
                          : null
                      }
                    </Table.Cell>
                    <Table.Cell><Link to={`/campaigns/${lead.campaign.id}`}>{lead.campaign.name}</Link></Table.Cell>
                    <Table.Cell>
                      {
                        !lead.deleted_at
                          ? <Button.Group>
                            <Button><Icon name='pencil alternate'/></Button>
                            <Button onClick={this.openConfirmModal.bind(this, true, lead.company_id, lead.id)}><Icon
                              name='trash alternate outline'/></Button>
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
                      totalPages={pagination.last_page}/>
        </Segment>
      </div>)
  }
}

export default compose(BreadCrumbContainer, LeadsContainer)(Leads);