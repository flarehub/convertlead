import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import LeadModal from '../@common/modals/lead';
import {compose} from 'recompose';
import * as moment from 'moment';
import {
    Table,
    Segment,
    Pagination,
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
    Popup,
} from 'semantic-ui-react';
import './index.scss';
import {BreadCrumbContainer, DealsContainer, CompaniesContainer, LeadsContainer, LeadFormContainer} from '@containers';
import Loader from '../loader';
import * as R from "ramda";
import {getSelectBoxStatuses} from "@models/lead-statuses";
import {Auth, config} from "@services";
import DatePickerSelect from "../@common/datepicker";
import {AvatarImage} from "../@common/image";

const companies = [
    {key: '', text: 'All companies', value: ''},
];

const defaultStatus = {key: '', text: 'All statuses', value: ''};


class Leads extends Component {
    dateDisplayFormat = 'MM/DD/Y';

    state = {
        open: false,
        status: null,
        leadId: null,
        companyId: null,
        campaignId: null,
        startDateDisplay: moment().startOf('isoWeek').format(this.dateDisplayFormat),
        endDateDisplay: moment().endOf('isoWeek').format(this.dateDisplayFormat),
        startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
        endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
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
    };

    onSearch = (event, data) => {
        this.props.searchLeads(data.value);
    };

    gotoPage = (event, data) => {
        this.props.gotoPage(data.activePage);
    };

    openConfirmModal = (open = true, companyId, leadId = null) => {
        this.setState({open, companyId, leadId})
    };

    onConfirm = () => {
        this.setState({open: false});
        this.props.delete(this.state.companyId, this.state.leadId);
    };

    onShowArch = () => {
        this.props.toggleShowDeleted();
    };

    filterByCompany = (event, data) => {
        this.props.filterLeads({
            companyId: data.value,
        })
    };

    filterByStatus = (event, data) => {
        this.setState({
            ...this.state,
            status: data.value,
        });
        this.props.filterLeads({
            statusType: data.value,
        })
    };

    onChangeDateFrom = (date) => {
        this.setState({
            ...this.state,
            startDate: moment(date).format('Y-MM-DD'),
            startDateDisplay: moment(date).format(this.dateDisplayFormat),
        });
    };

    onChangeDateTo = (date) => {
        this.setState({
            ...this.state,
            endDate: moment(date).format('Y-MM-DD'),
            endDateDisplay: moment(date).format(this.dateDisplayFormat),
        });

        this.props.filterLeads({
            startDate: this.state.startDate,
            endDate: moment(date).format('Y-MM-DD'),
        });
    };

    onRestDate = () => {
        this.setState({
            ...this.state,
            startDateDisplay: moment().startOf('isoWeek').format(this.dateDisplayFormat),
            endDateDisplay: moment().endOf('isoWeek').format(this.dateDisplayFormat),
            startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
            endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
        });

        this.props.filterLeads({
            startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
            endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
        });
    };

    componentWillMount() {
        const companyId = +R.pathOr('', ['match', 'params', 'companyId'], this.props);
        const campaignId = +R.pathOr('', ['match', 'params', 'campaignId'], this.props);
        const agentId = +R.pathOr('', ['match', 'params', 'agentId'], this.props);
        this.setState({
            ...this.state,
            companyId,
            campaignId,
        });

        this.props.filterLeads({
            companyId,
            campaignId,
            agentId,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        });

        this.props.addBreadCrumb({
            name: 'Leads',
            path: '/leads'
        });

        if (Auth.isAgency) {
            this.props.loadSelectBoxCompanies();
        }

        this.props.filterDealsByDealId(null);
        this.props.filterDealCampaignsById(null);
    }

    exportTo = (type) => {
        this.props.exportTo({
            type,
            statusType: this.props.query.filters.statusType,
            search: this.props.query.search,
            showDeleted: this.props.query.showDeleted,
            companyId: this.props.query.filters.companyId,
            campaignId: this.props.query.filters.campaignId,
            startDate: this.props.query.filters.startDate,
            endDate: this.props.query.filters.endDate,
        });
    };

    render() {
        const leads = this.props.leads || [];
        const {pagination, statuses, query} = this.props;
        const {companyId, campaignId, startDateDisplay, endDateDisplay, startDate, endDate} = this.state;
        return (
            <div className='Leads'>
                <LeadModal size='small'/>
                <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)} onConfirm={this.onConfirm}/>
                <Segment attached='top'>
                    <Grid columns={2}>
                        <Grid.Column>
                            <Header floated='left' as='h1'>Leads</Header>
                            <div className="field">
                                <label>Filter by: </label>
                                <Form>
                                    <Form.Group widths='equal'>
                                        {
                                            !campaignId && Auth.isAgency ?
                                                <Form.Field
                                                    loading={!this.props.selectBoxCompanies.length}
                                                    control={Select}
                                                    options={[...companies, ...this.props.selectBoxCompanies]}
                                                    placeholder='All companies'
                                                    search
                                                    onChange={this.filterByCompany}
                                                    defaultValue={companyId || null}
                                                    searchInput={{id: 'form-companies-list'}} />
                                                : null
                                        }

                                        <Form.Field
                                            loading={!getSelectBoxStatuses}
                                            control={Select}
                                            options={[defaultStatus, ...getSelectBoxStatuses]}
                                            placeholder='All statuses'
                                            search
                                            onChange={this.filterByStatus}
                                            searchInput={{id: 'form-statuses-list'}}
                                        />
                                    </Form.Group>
                                    <Popup position='bottom left'
                                           trigger={
                                               <Form.Field>
                                                   <Button>
                                                       <Icon name='calendar alternate outline'/>
                                                       {startDateDisplay} - {endDateDisplay}
                                                   </Button>
                                               </Form.Field>} flowing hoverable>

                                        <DatePickerSelect onChangeDateFrom={this.onChangeDateFrom}
                                                          onChangeDateTo={this.onChangeDateTo}
                                                          onRestDate={this.onRestDate}
                                                          from={new Date(startDate)} to={new Date(endDate)}/>
                                    </Popup>
                                </Form>
                                <div>Export your data
                                    <a href='#export-csv' onClick={this.exportTo.bind(this, 'TYPE_LEADS_CSV')}>.csv export</a>
                                    <a href='#export-pdf' onClick={this.exportTo.bind(this, 'TYPE_LEADS_PDF')}>.pdf export</a>
                                </div>
                            </div>
                            <Form.Field>
                                <Checkbox label='Show Archived' toggle onChange={this.onShowArch}/>
                            </Form.Field>

                        </Grid.Column>
                        <Grid.Column>
                            <Menu secondary>
                                <Menu.Menu position='right'>
                                    <Menu.Item>
                                        <Input icon='search' onChange={this.onSearch} value={query.search} placeholder='Search...'/>
                                    </Menu.Item>
                                    <Button color='teal' onClick={this.props.loadForm.bind(this, {show: true})} content='New Lead'/>
                                </Menu.Menu>
                            </Menu>
                        </Grid.Column>
                    </Grid>
                    <Segment basic>
                        <Loader/>
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
                                    {
                                        Auth.isAgency
                                            ? <Table.HeaderCell>Company
                                                <Icon name={this.getSort('company')}
                                                      onClick={this.props.sort.bind(this, 'company')}/>
                                            </Table.HeaderCell>
                                            : null
                                    }
                                    <Table.HeaderCell>Source
                                        <Icon name={this.getSort('campaign')}
                                              onClick={this.props.sort.bind(this, 'campaign')}/>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell><span className="linearicons-cog"/></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    leads.map((lead, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>
                                                <Link to={`/companies/${lead.company_id}/leads/${lead.id}/notes`}>
                                                    <div className={`lead-status-icon lead-status-${lead.status[0].toLowerCase()}`}>
                                                        {(lead.fullname && lead.fullname[0]) || statuses[lead.status].icon}
                                                    </div>
                                                    {lead.fullname}
                                                </Link>
                                                <div className='date-added'>
                                                    Added {moment.utc(lead.created_at).local().format('DD/MM/YYYY')}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {
                                                    lead.agent && <Link
                                                        to={`/agents/${lead.agent.id}/profile`}>{lead.agent.name}</Link>
                                                }
                                            </Table.Cell>
                                            <Table.Cell>{lead.email}</Table.Cell>
                                            <Table.Cell>{lead.phone}</Table.Cell>
                                            {
                                                Auth.isAgency
                                                    ? <Table.Cell>
                                                        {
                                                            lead.company
                                                                ? <div className="comp-logo-box">
                                                                    <AvatarImage avatar src={lead.company.avatar_path} rounded
                                                                                 size='mini'/>
                                                                    <Link to={`/companies/${lead.company.id}/profile`}>
                                                                        {lead.company.name}
                                                                    </Link>
                                                                </div>
                                                                : null
                                                        }
                                                    </Table.Cell>
                                                    : null
                                            }
                                            <Table.Cell><Link to={{
                                                pathname: (
                                                    Auth.isAgency
                                                        ? `/companies/${lead.company.id}/deals/${lead.deal_id}/campaigns`
                                                        : `/deals/${lead.deal_id}/campaigns`
                                                ),
                                                state: {deal: lead.campaign.deal}
                                            }}>{lead.campaign.name}</Link></Table.Cell>
                                            <Table.Cell>
                                                {
                                                    !lead.deleted_at
                                                        ? <Button.Group>
                                                            <Button onClick={this.props.loadForm.bind(this, {
                                                                ...lead,
                                                                company_id: lead.company.id,
                                                                show: true
                                                            })}>Edit</Button>
                                                            <Button
                                                                onClick={this.openConfirmModal.bind(this, true, lead.company_id, lead.id)}>Archieve</Button>
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

export default compose(BreadCrumbContainer, DealsContainer, CompaniesContainer, LeadsContainer, LeadFormContainer)(Leads);