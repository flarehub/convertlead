import React, {Component} from 'react';
import {compose} from 'recompose';
import {BreadCrumbContainer, AgentsContainer, AgentFormContainer, CompaniesContainer, LeadsContainer} from '@containers';
import AgentModal from '../@common/modals/agent';
import {
    Button,
    Confirm,
    Form,
    Grid,
    Header,
    Input,
    Menu,
    Segment,
    Select,
    Tab,
    Popup, 
    Icon    
} from 'semantic-ui-react';
import './index.scss';
import * as R from "ramda";
import {Auth} from "@services";
import {disableAutoComplete} from '../../utils';
import AgentProfile from "../agent-profile";
import * as moment from 'moment';
import ButtonGroup from '../@common/button-group';
import Loader from '../loader';

const companies = [
    {key: null, text: 'All companies', value: null},
];

class Agents extends Component {
    state = {
        open: false,
        agentId: null,
        agent: {},
        companyId: null,
        activeIndex: 0,
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
            this.props.loadSelectBoxCompanies('');
        }

        this.setState({
            ...this.state,
            companyId: companyId
        })
        this.props.loadAgents();
    }

    onChangeCompany = (event, data) => {
        this.props.filterAgents({
            companyId: data.value
        });
      };

    onClickViewAgentProfile = (agent) => {
        document.getElementsByClassName('Leads')[0].className = 'Leads sidebarOpened';
        this.setState({
            ...this.state,
            agent,
        });
    
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

    onShowArch = (e, tab) => {
        if (tab.activeIndex === this.state.activeIndex) {
          return;
        }
    
        this.setState({
          ...this.state,
          activeIndex: tab.activeIndex,
        });

        this.props.toggleAgentsShowDeleted();
    };

    onPreviewAgentChange = (agent) => {

        // this.setState({
        //   ...this.state,
        //   previewLeadId: agent.id,
        //   companyId: agent.company_id
        // })
    }

    componentDidMount() {
        disableAutoComplete();
    }

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
        const agents = this.props.agents || [];
        const {pagination, query} = this.props;
        const {companyId, agentId, agent} = this.state;

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
            <div className='Leads'>
                <div className="leads-container">
                    <Segment attached='top'>
                        <Grid columns={2}>
                            <Grid.Column>
                                <Header floated='left' as='h1'>Agents</Header>
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
                    </Segment>
                    <Tab onTabChange={this.onShowArch} menu={{ secondary: true, pointing: true }} panes={tabs} />
                    <Confirm open={this.state.open} onCancel={this.openConfirmModal.bind(this, false)} onConfirm={this.onConfirm}/>
                    <Segment basic>
                    <div className="leadFilters">
                        <div className="field">                            
                        <Form>       
                            <Form.Group widths='equal' className='filter white'>
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
                        <div className='exportbox'>Export your data
                            <a href='#export-csv' onClick={this.exportTo.bind(this, 'TYPE_LEADS_CSV')}>.csv export</a>
                            <a href='#export-pdf' onClick={this.exportTo.bind(this, 'TYPE_LEADS_PDF')}>.pdf export</a>
                        </div>                            
                    </div>                    
                        <Loader/>
                        {
                            agents.map((agent, index) => (
                                <div data-id={agent.id} className="agentContainer" onClick={() => this.onClickViewAgentProfile(agent)}>
                                    <div className="agentMenu">
                                        <div className="bullets">...</div>
                                        {
                                            !agent.deleted_at && (
                                                <ButtonGroup>
                                                    <Button style={{width: '90px'}} onClick={this.props.loadForm.bind(this, {
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
                                                    agent.campaigns_count != 0 && (
                                                        <span className="legendName-blue">Leads</span>
                                                    ) || (
                                                        <span className="legendName-red">Leads</span>
                                                    )
                                                }
                                                {/* <AvatarImage  circular src={agent.avatar_path || avatarDemo}/> */}
                                                {   
                                                    agent.campaigns_count != 0 && (
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
                                                {/* {agent.integration_count || 0} */}
                                                {agent.campaigns_count || 0}
                                                
                                                &nbsp;
                                                Integrations
                                            </span>
                                        </div>
                                        <div className="campaignStatus">
                                            {
                                                agent.campaigns_count != 0 && (
                                                    <button className="ui teal button active-btn" >Active</button>
                                                ) || (
                                                    <button className="ui teal button inactive-btn" >Inactive</button>
                                                )
                                            }
                                        </div>
                                        {
                                            agent.companies && (
                                                <div className="campaignNames">
                                                    <span>assigned to</span>
                                                    {
                                                        agent.companies && agent.companies.map(({name}) => <div className="campaignName">{name}</div>)
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </Segment>
                    <AgentModal/>
                        {
                            agent.id && <AgentProfile s_agent={agent} agentId={agent.id} onClose={() => this.setState({agent: {}})} />
                        }                       
                </div>                
            </div>)
    }
}

export default compose(BreadCrumbContainer, CompaniesContainer, AgentsContainer, AgentFormContainer, LeadsContainer)(Agents);
