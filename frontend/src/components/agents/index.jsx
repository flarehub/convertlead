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
    Pagination,
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
import AgentPane from './AgentPane'

const companies = [
    {key: null, text: 'All companies', value: null},
];

class Agents extends Component {
    state = {
        open: false,
        agentId: null,
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
    
        this.props.toggleShowDeleted();
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

    render() {
        const agents = this.props.agents || [];
        const {pagination, query} = this.props;
        const {companyId, agentId} = this.state;
        const tabs = [
            {
              menuItem: 'Active',
              render: () => <AgentPane onPreviewAgentChange={this.onPreviewAgentChange} />
            },
            {
              menuItem: 'Archived',
              render: () => <AgentPane onPreviewAgentChange={this.onPreviewAgentChange} />
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
                </div>                
            </div>)
    }
}

export default compose(BreadCrumbContainer, CompaniesContainer, AgentsContainer, AgentFormContainer, LeadsContainer)(Agents);
