import React, { Component } from 'react';
import { compose } from 'recompose';
import { BreadCrumbContainer, AgentsContainer } from '@containers';
import * as moment from 'moment';
import {
  Table,
  Segment,
  Dimmer,
  Loader,
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
import * as R from "ramda";
import EntityModal from "../@common/modals/enitity";

class Agents extends Component {
  state = {
    open: false,
    agentId: null,
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

  onSearch = (event, data) => {
    this.props.search(data.value);
  }

  onSave = (data) => {
  }

  gotoPage = (event, data) => {
    this.props.gotoPage(data.activePage);
  }

  openConfirmModal = (open = true, companyId, agentId = null) => {
    this.setState({ open, companyId, agentId })
  }

  onConfirm = () => {
    this.setState({ open: false });
    this.props.delete(this.state.companyId, this.state.agentId);
  }

  onShowArch = () => {
    this.props.toggleShowDeleted();
  }

  componentWillMount() {
    this.props.addBreadCrumb({
      name: 'Agents',
      path: '/agents'
    });
    this.props.loadAgents();
  }

  render() {
    const agents = this.props.agents || [];
    const { pagination, openModalStatus  } = this.props;

    return (
      <div className={styles.Agents}>
        <EntityModal open={openModalStatus} title='Agent Create' onSave={this.onSave} onClose={this.props.openModal.bind(this, false)}/>
        <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)} onConfirm={this.onConfirm} />
        <Segment attached='top'>
          <Grid columns={2}>
            <Grid.Column>
              <Header floated='left' as='h1'>Agents</Header>
              <Form.Field>
                <Checkbox label='Show Archived' toggle onChange={this.onShowArch} />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Menu secondary>
                <Menu.Menu position='right'>
                  <Menu.Item>
                    <Input icon='search' onChange={this.onSearch} placeholder='Search...' />
                  </Menu.Item>
                  <Button color='teal' onClick={this.props.openModal.bind(this, true)} content='New Agent' icon='add' labelPosition='left' />
                </Menu.Menu>
              </Menu>
            </Grid.Column>
          </Grid>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name
                  <Icon name={this.getSort('name')}
                        onClick={this.props.sort.bind(this, 'name')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Company</Table.HeaderCell>
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
                      {agent.name}
                      <div>
                        Added {moment(agent.created_at).format('DD/MM/YYYY')}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {
                        agent.company
                        ? <div>
                            <Image avatar src={agent.company.avatar_path} rounded size='mini' />
                            {agent.company.name}
                          </div>
                        : null
                      }

                    </Table.Cell>
                    <Table.Cell>{agent.campaigns_count || 0}</Table.Cell>
                    <Table.Cell>{agent.leads_count || 0}</Table.Cell>
                    <Table.Cell>{agent.avg_lead_response || 0}</Table.Cell>
                    <Table.Cell>
                      {
                        !agent.is_deleted
                          ?<Button.Group>
                            <Button><Icon name='pencil alternate' /></Button>
                            <Button onClick={this.openConfirmModal.bind(this, true, agent.company_id, agent.id)}><Icon name='trash alternate outline'/></Button>
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
          <Pagination onPageChange={this.gotoPage}
                      defaultActivePage={pagination.current_page}
                      prevItem={null}
                      nextItem={null}
                      totalPages={pagination.last_page} />
        </Segment>
    </div>)
  }
}

export default compose(BreadCrumbContainer, AgentsContainer)(Agents);