import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeadModal from '../@common/modals/lead';
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
  Select,
} from 'semantic-ui-react';
import styles from './index.scss';
import { BreadCrumbContainer, CompaniesContainer, LeadsContainer, LeadFormContainer } from '@containers';
import Loader from '../loader';
import * as R from "ramda";
import {getSelectBoxStatuses} from "@models/lead-statuses";

const companies = [
  { key: '', text: 'All companies', value: '' },
];

const defaultStatus =  { key: '', text: 'All statuses', value: '' };


class Leads extends Component {
  state = {
    open: false,
    leadId: null,
    companyId: null,
    campaignId: null,
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

  filterByCompany = (event, data) => {
    this.props.filterLeads({
      companyId: data.value,
    })
  }

  filterByStatus = (event, data) => {
    this.props.filterLeads({
      statusType: data.value,
    })
  }

  componentWillMount() {
    const companyId = +R.pathOr('', ['match', 'params', 'companyId'], this.props);
    const campaignId = +R.pathOr('', ['match', 'params', 'campaignId'], this.props);
    this.setState({
      ...this.state,
      companyId,
      campaignId,
    });

    this.props.filterLeads({
      companyId,
      campaignId,
    });

    this.props.addBreadCrumb({
      name: 'Leads',
      path: '/leads'
    });
  }

  render() {
    const leads = this.props.leads || [];
    const {pagination, statuses, query} = this.props;
    const { companyId, campaignId } = this.state;
    return (
      <div className={styles.Leads}>
        <LeadModal size='small' />
        <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)} onConfirm={this.onConfirm}/>
        <Segment attached='top'>
          <Grid columns={3}>
            <Grid.Column>
              <Header floated='left' as='h1'>Leads</Header>
              <Form.Field>
                <Checkbox label='Show Archived' toggle onChange={this.onShowArch}/>
              </Form.Field>
            </Grid.Column>
            <Grid.Column textAlign='left'>
              <label>Filter by: </label>
             <Form>
               <Form.Group widths='equal'>
                 {
                   !campaignId
                     ?  <Form.Field
                       loading={!this.props.selectBoxCompanies.length}
                       control={Select}
                       options={[...companies, ...this.props.selectBoxCompanies]}
                       placeholder='All companies'
                       search
                       onChange={this.filterByCompany}
                       defaultValue={companyId}
                       searchInput={{ id: 'form-companies-list' }}
                     />
                     : null
                 }

                 <Form.Field
                   loading={!getSelectBoxStatuses}
                   control={Select}
                   options={[defaultStatus, ...getSelectBoxStatuses]}
                   placeholder='All statuses'
                   search
                   onChange={this.filterByStatus}
                   searchInput={{ id: 'form-statuses-list' }}
                 />
               </Form.Group>
             </Form>
            </Grid.Column>
            <Grid.Column>
              <Menu secondary>
                <Menu.Menu position='right'>
                  <Menu.Item>
                    <Input icon='search' onChange={this.onSearch} value={query.search} placeholder='Search...'/>
                  </Menu.Item>
                  <Button color='teal' onClick={this.props.loadForm.bind(this, { show: true })} content='New Lead' icon='add'
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
                      <Link to={`/companies/${lead.company_id}/leads/${lead.id}/notes`}>
                        <div className={`lead-status-icon lead-status-${lead.status[0].toLowerCase()}`}>{lead.fullname && lead.fullname[0] || statuses[lead.status].icon}</div>
                        {lead.fullname}
                        <div>
                          Added {moment(lead.created_at).format('DD/MM/YYYY')}
                        </div>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {
                        lead.agent && <Link to={`/agents/${lead.agent.id}`}>{lead.agent.name}</Link>
                      }
                    </Table.Cell>
                    <Table.Cell>{lead.email}</Table.Cell>
                    <Table.Cell>{lead.phone}</Table.Cell>
                    <Table.Cell>
                      {
                        lead.company
                          ? <div>
                            <Link to={`/companies/${lead.company.id}/profile`}>
                              <Image avatar src={lead.company.avatar_path} rounded size='mini'/>
                              {lead.company.name}
                            </Link>
                          </div>
                          : null
                      }
                    </Table.Cell>
                    <Table.Cell><Link to={{
                      pathname: `/companies/${lead.company.id}/deals/${lead.deal_id}/campaigns`,
                      state: { deal: lead.campaign.deal }
                    }}>{lead.campaign.name}</Link></Table.Cell>
                    <Table.Cell>
                      {
                        !lead.deleted_at
                          ? <Button.Group>
                            <Button onClick={this.props.loadForm.bind(this, { ...lead, company_id: lead.company.id, show: true })} ><Icon name='pencil alternate'/></Button>
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

export default compose(BreadCrumbContainer, CompaniesContainer, LeadsContainer, LeadFormContainer)(Leads);