import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import * as styles from './index.scss';
import {
  BreadCrumbContainer,
  CampaignsContainer
} from "@containers";
import Loader from '../loader';
import {
  Segment, Confirm, Checkbox, Header, Menu, Image, Form, Select, Input,
  Grid, Button, Table, Icon, Pagination,
} from 'semantic-ui-react';
import * as R from "ramda";

class Campaigns extends Component {
  state = {
    open: false,
    campaignId: '',
    companyName: 'Company',
    dealName: 'Deal'
  };

  constructor(props) {
    super(props);
    const { companyId, dealId } = props.match.params;
    props.loadCampaigns(companyId, dealId);
  }

  componentDidMount() {
    const { companyId } = this.props.match.params;
    const deal = R.pathOr({
      name: 'Deal',
      company: {
        name: 'Company',
      }
    }, ['history', 'location', 'state', 'deal'], this.props);

    this.props.addBreadCrumb({
      name: deal.company.name,
      path: `/companies/${companyId}/profile`,
    });

    this.props.addBreadCrumb({
      name: deal.name,
      path: '/',
      active: true,
    }, false);
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

  openConfirmModal = (open = true, companyId = '', dealId = '') => {
    this.setState({ open, companyId, dealId })
  }

  onConfirm = () => {
    this.setState({ open: false });
    this.props.deleteDeal(this.state.companyId, this.state.dealId);
  };

  onShowArch = () => {
    this.props.toggleShowDeleted();
  };

  gotoPage = (event, data) => {
    this.props.gotoPage(data.activePage);
  }

  render() {
    const { campaigns, pagination } = this.props;
    return (<div className={styles.Campaigns}>
      <Segment attached='top'>
        <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)} onConfirm={this.onConfirm} />
        <Grid columns={2}>
          <Grid.Column>
            <Header floated='left' as='h1'>Campaigns</Header>
            <Form.Field>
              <Checkbox label='Show Archived' toggle onChange={this.onShowArch} />
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Menu secondary>
              <Menu.Menu position='right'>
                <Button color='teal' content='New Campaign' icon='add' labelPosition='left' />
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
        <Segment basic>
          <Loader />
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Name
                  <Icon name={this.getSort('name')}
                        onClick={this.props.sort.bind(this, 'name')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Type
                  <Icon name={this.getSort('type')}
                        onClick={this.props.sort.bind(this, 'type')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Leads  <Icon name={this.getSort('leads')}
                                               onClick={this.props.sort.bind(this, 'leads')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Assigned to</Table.HeaderCell>
                <Table.HeaderCell>
                  Avg Response time
                  <Icon name={this.getSort('avg_time_response')}
                        onClick={this.props.sort.bind(this, 'avg_time_response')}/>
                </Table.HeaderCell>
                <Table.HeaderCell>Edit/Access/Archieve</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                campaigns.map((campaign, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Button circular color='facebook' icon='facebook' />
                    </Table.Cell>
                    <Table.Cell>{campaign.name}</Table.Cell>
                    <Table.Cell>{campaign.integration}</Table.Cell>
                    <Table.Cell>{campaign.leads_count}</Table.Cell>
                    <Table.Cell>{
                      campaign.agents && campaign.agents.map((agent, key) => <Link key={key} to={`/agents/${agent.id}`}>{agent.name}</Link>)
                    }</Table.Cell>
                    <Table.Cell>{campaign.avg_time_response || 0}</Table.Cell>
                    <Table.Cell>
                      {/*{*/}
                        {/*!campaign.is_deleted*/}
                          {/*?<Button.Group>*/}
                            {/*<Button onClick={this.props.loadForm.bind(this, { ...campaign, show: true })}><Icon name='pencil alternate' /></Button>*/}
                            {/*<Button onClick={this.onLockCompany.bind(this, campaign)}><Icon name={campaign.is_locked ? 'lock' : 'lock open'} /></Button>*/}
                            {/*<Button onClick={this.openConfirmModal.bind(this, true, campaign.id)}><Icon name='trash alternate outline'/></Button>*/}
                          {/*</Button.Group>*/}
                          {/*: null*/}
                      {/*}*/}
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

    </div>);
  }
}

export default compose(CampaignsContainer, BreadCrumbContainer)(Campaigns);
