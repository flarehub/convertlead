import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import './index.scss';
import {
  AgentsContainer,
  BreadCrumbContainer,
  CampaignFormContainer,
  CampaignsContainer,
  OptinFormIntegrationContainer,
  ProfileContainer,
} from "@containers";
import Loader from '../loader';
import {
  Segment, Confirm, Checkbox, Header, Menu, Image, Form, Select, Input,
  Grid, Button, Table, Icon, Pagination,
} from 'semantic-ui-react';
import * as R from "ramda";
import CampaignModal from 'components/@common/modals/campaign';
import ModalOptinFormIntegration from 'components/@common/modals/integrations/optinform';
import ZapierInterationModal from "../@common/modals/integrations/zapier";
import { Auth, config} from "@services";

class Campaigns extends Component {
  state = {
    open: false,
    openApiIntegration: false,
    campaignId: '',
    campaignLink: '',
    companyId: '',
    dealId: '',
  };

  constructor(props) {
    super(props);
    const { companyId, dealId, agentId } = props.match.params;
    if (agentId) {
      props.loadAgentCampaigns(agentId);
    } else {
      props.loadDealCampaigns(companyId, dealId);
    }
  }

  componentWillMount() {
    const { companyId, agentId, dealId } = this.props.match.params;
    this.setState({
      ...this.state,
      companyId: +companyId || (Auth.isCompany ? this.props.profile.id : null),
      agentId: +agentId,
      dealId: +dealId,
    })
  }

  componentDidMount() {
    const deal = R.pathOr({
      name: 'Deal',
      company: {
        name: 'Company',
      }
    }, ['history', 'location', 'state', 'deal'], this.props);

    if (this.state.companyId) {
      this.props.addBreadCrumb({
        name: deal.name,
        path: '/dashboard',
      });
    }

    if (this.state.companyId && Auth.isAgency) {
      this.props.addBreadCrumb({
        name: deal.company.name,
        path: `/companies/${this.state.companyId}/profile`,
      });
    }

    if (this.state.companyId) {
      this.props.addBreadCrumb({
        name: 'Campaigns',
        path: '/',
        active: true,
      }, false);
    }



    if (this.state.agentId) {
      const agentName = R.pathOr('Agent', ['location', 'state', 'agent', 'name'], this.props);
      this.props.addBreadCrumb({
        name: 'Agents',
        path: `/agents`,
      });

      this.props.addBreadCrumb({
        name: agentName,
        path: `/agents/${this.state.agentId}/profile`,
      }, false);

      this.props.addBreadCrumb({
        name: 'Campaigns',
        path: '',
      }, false);
    }
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
  };

  openConfirmModal = (open = true, campaignId = '') => {
    this.setState({ open, campaignId})
  };

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
    if (campaign.integration === 'OPTIN_FORM') {
      this.props.loadOptinForm({ ...campaign, companyId: campaign.company_id, dealId: campaign.deal_id, show: true })
    }

    if (campaign.integration === 'ZAPIER') {
      this.setState({
        ...this.state,
        openApiIntegration: true,
        campaignLink: `${config.get('REACT_APP_API_SERVER')}/v1/campaigns/${campaign.uuid}/leads`
      });
    }
  };

  onCloseApiIntegration = () => {
    this.setState({
      ...this.state,
      openApiIntegration: false,
    });
  };

  render() {
    const { campaigns, pagination } = this.props;
    return (<div className='Campaigns'>
      <Segment attached='top'>
        <ZapierInterationModal open={this.state.openApiIntegration} onClose={this.onCloseApiIntegration} campaignLink={this.state.campaignLink} />
        <ModalOptinFormIntegration />
        <CampaignModal
          companyId={this.state.companyId}
          dealId={this.state.dealId}
          agentId={this.state.agentId}
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
                <Button color='teal' content='New Campaign' onClick={this.props.loadForm.bind(this, { agentId: this.state.agentId, show: true })} labelPosition='left' />
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
                {
                  this.state.agentId && Auth.isAgency ? <Table.HeaderCell>Company</Table.HeaderCell> : null
                }
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
                      {
                        campaign.integration === 'FACEBOOK'
                        ? <Button circular color='facebook' icon='facebook' />
                        : null
                      }
                      {
                        campaign.integration === 'ZAPIER'
                        ?  <Button circular color='orange' icon='asterisk' />
                        : null
                      }
                      {
                        campaign.integration === 'OPTIN_FORM'
                          ?  <Button circular color='grey' icon='bars' />
                          : null
                      }
                    </Table.Cell>
                    <Table.Cell>{campaign.name}</Table.Cell>
                    <Table.Cell>{campaign.integration}</Table.Cell>
                    <Table.Cell><Link to={`/companies/${campaign.company.id}/campaigns/${campaign.id}/leads`}>{campaign.leads_count || 0}</Link></Table.Cell>
                    <Table.Cell>{
                      campaign.agents && campaign.agents.map((agent, key) =>
                        <div key={key}><Link to={`/agents/${agent.id}/profile`}>{agent.name}</Link></div>)
                    }</Table.Cell>
                    {
                      this.state.agentId && Auth.isAgency ? <Table.Cell>
                        <Link to={`/companies/${campaign.company.id}/profile`}>{campaign.company.name}</Link>
                        </Table.Cell> : null
                    }
                    <Table.Cell>{campaign.avg_time_response || 0}</Table.Cell>
                    <Table.Cell>
                      {
                        !campaign.deleted_at
                        ?
                            <><Button className={"integration-but"} onClick={this.loadIntegrationForm.bind(this, campaign)}>Integration</Button>
                            <Button.Group>
                            <Button onClick={this.props.loadForm.bind(this, { ...campaign,
                              companyId: campaign.company_id,
                              dealId: campaign.deal_id,
                              agentId: this.state.agentId,
                              agents: campaign.agents && campaign.agents.map(agent => agent.id), show: true })}>
                              Edit
                            </Button>
                            <Button onClick={this.openConfirmModal.bind(this, true, campaign.id)}>Archieve</Button>
                          </Button.Group></>
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

    </div>);
  }
}

export default compose(OptinFormIntegrationContainer, ProfileContainer, AgentsContainer, CampaignsContainer, CampaignFormContainer, BreadCrumbContainer)(Campaigns);
