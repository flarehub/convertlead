import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import * as styles from './index.scss';
import {
  BreadCrumbContainer,
  CampaignsContainer,
  CampaignFormContainer,
  OptinFormIntegrationContainer,
} from "@containers";
import Loader from '../loader';
import {
  Segment, Confirm, Checkbox, Header, Menu, Image, Form, Select, Input,
  Grid, Button, Table, Icon, Pagination,
} from 'semantic-ui-react';
import * as R from "ramda";
import CampaignModal from 'components/@common/modals/campaign';
import ModalOptinFormIntegration from 'components/@common/modals/integrations/optinform';

class Campaigns extends Component {
  state = {
    open: false,
    campaignId: '',
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

  openConfirmModal = (open = true, campaignId = '') => {
    this.setState({ open, campaignId})
  }

  onConfirm = () => {
    this.setState({ open: false });
    const { companyId, dealId } = this.props.match.params;
    this.props.deleteCampaign(companyId, dealId, this.state.campaignId);
  };

  onShowArch = () => {
    this.props.toggleShowDeleted();
  };

  gotoPage = (event, data) => {
    this.props.gotoPage(data.activePage);
  }

  loadIntegrationForm = campaign => {
    const { companyId, dealId } = this.props.match.params;
    if (campaign.integration === 'OPTIN_FORM') {
      this.props.loadOptinForm({ ...campaign, companyId, dealId, show: true })
    }
  };

  render() {
    const { campaigns, pagination } = this.props;
    return (<div className={styles.Campaigns}>
      <Segment attached='top'>
        <ModalOptinFormIntegration />
        <CampaignModal
          companyId={this.props.match.params.companyId}
          dealId={this.props.match.params.dealId}
        />
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
                <Button color='teal' content='New Campaign' onClick={this.props.loadForm.bind(this, { show: true })} icon='add' labelPosition='left' />
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
                      campaign.agents && campaign.agents.map((agent, key) =>
                        <div key={key}><Link to={`/agents/${agent.id}`}>{agent.name}</Link></div>)
                    }</Table.Cell>
                    <Table.Cell>{campaign.avg_time_response || 0}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={this.loadIntegrationForm.bind(this, campaign)}>Integration</Button>
                        <Button onClick={this.props.loadForm.bind(this, { ...campaign, agents: campaign.agents && campaign.agents.map(agent => agent.id), show: true })}><Icon name='pencil alternate' /></Button>
                        <Button onClick={this.openConfirmModal.bind(this, true, campaign.id)}><Icon name='trash alternate outline'/></Button>
                      </Button.Group>
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

export default compose(OptinFormIntegrationContainer, CampaignsContainer, CampaignFormContainer, BreadCrumbContainer)(Campaigns);
