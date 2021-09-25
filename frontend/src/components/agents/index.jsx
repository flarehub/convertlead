import React, {Component} from 'react';
import {compose} from 'recompose';
import {BreadCrumbContainer, AgentsContainer, AgentFormContainer} from '@containers';
import AgentModal from '../@common/modals/agent';
import {
    Button,
    Confirm,
    Form,
    Grid,
    Header,
    Input,
    Menu,
    Pagination,
    Segment,
    Select,
    Tab,
    Popup, 
    Icon    
} from 'semantic-ui-react';
import './index.scss';
import Loader from '../loader';
import * as R from "ramda";
import {CompaniesContainer} from "@containers";
import {Auth} from "@services";
import {AvatarImage} from "../@common/image";
import ButtonGroup from 'components/@common/button-group';
import {disableAutoComplete} from '../../utils';
import AgentProfile from "../agent-profile";
import avatarDemo from "../@common/forms/avatar-demo.png";
import DatePickerSelect from "components/@common/datepicker";
import * as moment from 'moment';

const companies = [
    {key: null, text: 'All companies', value: null},
];

class Agents extends Component {
    state = {
        open: false,
        agentId: null,
        companyId: null,
        startDateDisplay: moment().startOf('isoWeek').format('MM/DD/Y'),
        endDateDisplay: moment().endOf('isoWeek').format('MM/DD/Y'),        
        startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
        endDate: moment().endOf('isoWeek').format('Y-MM-DD'),                
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

        if (Auth.isAgency) {
            this.props.loadSelectBoxCompanies();
        }

        this.setState({
            ...this.state,
            companyId: companyId
        })
    }

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
        this.props.search(data.value);
    };

    gotoPage = (event, data) => {
        this.props.gotoPage(data.activePage);
    };

    openConfirmModal = (open = true, agentId = null) => {
        this.setState({open, agentId});
    };

    onConfirm = () => {
        this.setState({open: false});
        this.props.delete(this.state.agentId);
    };

    onRestore = (agentId) => {
        this.props.restore(agentId);
    };

    onShowArch = () => {
        this.props.toggleShowDeleted();
    };

    onChangeCompany = (event, data) => {
        this.props.filterAgents({
            companyId: data.value
        });
    };

    onClickViewAgentProfile = (agentId) => {
        this.setState({
            ...this.state,
            agentId,
        });
    }

    componentDidMount() {
        disableAutoComplete();
    }

    render() {
        const agents = this.props.agents || [];
        const {pagination, query} = this.props;
        const {companyId, agentId} = this.state;
        const tabs = [
            {
              menuItem: 'Active',
              render: () => <></>
            },
            {
              menuItem: 'Archived',
              render: () => <></>
            }
          ];        
        return (
            <div className='Agents'>
                <AgentModal/>
                {
                    agentId && <AgentProfile agentId={agentId} onClose={() => this.onClickViewAgentProfile(null)} />
                }
                <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)}
                         onConfirm={this.onConfirm}/>
                <Segment attached='top'>
                    <Grid columns={2}>
                        <Grid.Column>
                            <Header floated='left' as='h1'>Agents</Header>
                            <Form.Field>
                                <Tab onTabChange={this.onShowArch} menu={{ secondary: true, pointing: true }} panes={tabs} />
                            </Form.Field>
                            <div className="leadFilters">
                                <div className="field">                            
                            <Form>       
                                <Form.Group widths='equal'> 
                                {
                                    Auth.isAgency
                                        ? 
                                        <Form.Field
                                        control={Select}
                                        options={[...companies, ...this.props.selectBoxCompanies]}
                                        placeholder='All companies'
                                        search
                                        onChange={this.onChangeCompany}
                                        defaultValue={companyId || null}
                                        searchInput={{id: 'form-companies-list'}}/>                                        
                                        : null
                                }
                                                                                       
                                </Form.Group>

                            </Form>
                            </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <Menu secondary>
                                <Menu.Menu position='right'>
                                    <Menu.Item>
                                        <Input icon='search' onChange={this.onSearch} value={query.search || ''}
                                               placeholder='Search...'/>
                                    </Menu.Item>
                                    <Button color='teal' className="new-campaign" 
                                        onClick={this.props.loadForm.bind(this, {show: true})} ><i className="flaticon stroke plus-1  icon"></i></Button>                                            
                                </Menu.Menu>
                            </Menu>
                        </Grid.Column>
                    </Grid>
                    
                    <Segment basic>
                        <Loader/>
                            {
                                agents.map((agent, index) => (
                                    <div data-id={agent.id} className="agentContainer" onClick={() => this.onClickViewAgentProfile(agent.id)}>
                                        <div className="agentMenu">
                                            <div className="bullets">...</div>
                                            {
                                                !agent.deleted_at && (
                                                  <ButtonGroup>
                                                      <Button onClick={this.props.loadForm.bind(this, {
                                                          ...agent,
                                                          show: true
                                                      })}>Edit</Button>
                                                      <Button onClick={this.openConfirmModal.bind(this, true, agent.id)}>Archive</Button>
                                                  </ButtonGroup>
                                                ) || (
                                                  <ButtonGroup>
                                                      <Button onClick={this.props.loadForm.bind(this, {
                                                          ...agent,
                                                          show: true
                                                      })}>Edit</Button>
                                                      <Button onClick={() => this.onRestore(agent.id)}>Restore</Button>
                                                  </ButtonGroup>
                                                )
                                            }
                                        </div>
                                        <div className="agentDetails">
                                            <div className="agentAvatar">
                                                <div className="legend">
                                                    <span className="legendCount">
                                                        {agent.leads_count}
                                                    </span>
                                                    {
                                                        agent.deals && agent.deals.length != 0 && (
                                                            <span className="legendName-blue">Leads</span>
                                                        ) || (
                                                            <span className="legendName-red">Leads</span>
                                                        )
                                                    }
                                                    {/* <AvatarImage  circular src={agent.avatar_path || avatarDemo}/> */}
                                                    {   
                                                        // console.log("agent.integration_count", agent.deals.length), 
                                                        agent.deals && agent.deals.length != 0 && (
                                                            <div className="circular icon-image-blue" style={{ backgroundImage: 'url(http://localhost:8000/images/user.png)'}}></div>                                                    
                                                        ) || (
                                                            <div className="circular icon-image-red" style={{ backgroundImage: 'url(http://localhost:8000/images/user.png)'}}></div>                                                    
                                                        )
                                                    }
                                                </div>
                                                
                                                <div className="agentName">
                                                    {agent.name}
                                                </div>
                                            </div>
                                            <div className="integrationCount">
                                                <span>
                                                    {agent.integration_count || 0}
                                                    &nbsp;
                                                    Integrations
                                                </span>
                                            </div>
                                            <div className="campaignStatus">
                                                {
                                                    agent.deals && agent.deals.length != 0 && (
                                                        <button class="ui teal button active-btn" >Active</button>
                                                    ) || (
                                                        <button class="ui teal button inactive-btn" >Inactive</button>
                                                    )
                                                }
                                            </div>
                                            {
                                                agent.deals && (
                                                  <div className="campaignNames">
                                                      <span>assigned to</span>
                                                      {
                                                          agent.deals && agent.deals.map(({name}) => <div className="campaignName">{name}</div>)
                                                      }
                                                  </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                    </Segment>
                </Segment>
                {/* <Segment textAlign='right' attached='bottom'>
                    <Pagination onPageChange={this.gotoPage}
                                defaultActivePage={pagination.current_page}
                                prevItem={null}
                                nextItem={null}
                                totalPages={pagination.last_page}/>
                </Segment> */}
            </div>)
    }
}


export default compose(BreadCrumbContainer, CompaniesContainer, AgentsContainer, AgentFormContainer)(Agents);
