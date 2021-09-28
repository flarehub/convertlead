import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {compose} from 'recompose';
import * as moment from 'moment';
import {
  Button,
  Confirm,
  Form,
  Segment,
  Select, 
} from 'semantic-ui-react';
import './index.scss';

import {BreadCrumbContainer, AgentsContainer, AgentFormContainer, CompaniesContainer, LeadsContainer} from '@containers';
import AgentModal from '../@common/modals/agent';
import AgentProfile from "../agent-profile";

import Loader from '../loader';
import * as R from "ramda";
import {Auth} from "@services";
import { AvatarImage } from '../@common/image';
import {DATE_FORMAT} from '@constants';
import ButtonGroup from '../@common/button-group';

const defaultStatus = {key: '', text: 'All statuses', value: ''};
const companies = [
  {key: null, text: 'All companies', value: null},
];

class AgentPane extends React.Component {
  dateDisplayFormat = 'MM/DD/Y';

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

  render () {

    const agents = this.props.agents || [];
    const {pagination, query} = this.props;
    const {companyId, agent} = this.state;
    return (
      <div>
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
    )
  }
}
// export default compose(BreadCrumbContainer, DealsContainer, CompaniesContainer, LeadsContainer, LeadFormContainer)(AgentPane);
export default compose(BreadCrumbContainer, CompaniesContainer, AgentsContainer, AgentFormContainer, LeadsContainer)(AgentPane);
