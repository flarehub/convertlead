import React, {Component} from 'react';
import {compose} from 'recompose';
import {
    Segment, Grid, Button, Select, Form, Header, Menu, Popup, Icon
} from 'semantic-ui-react';
import './index.scss';
import {AgentsContainer, BreadCrumbContainer, AgentFormContainer} from "@containers";
import ChartJs from 'chart.js';
import DatePickerSelect from "components/@common/datepicker";
import * as moment from 'moment';
import * as R from 'ramda';
import AgentModal from '../@common/modals/agent';
import {Auth} from "@services";
import {disableAutoComplete} from '../../utils';
import { actionTypes } from '../../@containers/forms/automation/actionTypes';

class AgentProfile extends Component {
    
    state = {
        agent: {},
        companyIds: [],
        startDateDisplay: moment().startOf('isoWeek').format('MM/DD/Y'),
        endDateDisplay: moment().endOf('isoWeek').format('MM/DD/Y'),
        startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
        endDate: moment().endOf('isoWeek').format('Y-MM-DD'),        
    };

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentWillMount() {
        // console.log(this.props);
        this.props.getAgent(this.props.agentId, true);
    }

    componentDidMount() {
        // this.props.resetBreadCrumbToDefault();
        disableAutoComplete();
        let opt = this.props.pieGraphContactedLeadsAverage;
        opt.options.legendCallback = function (chart) {
            let ul = document.createElement('ul');
            let i = 0;
            chart.data.labels.forEach(function (item) {
                ul.innerHTML += `<li style="display: inline; margin-right: 10px"><div style="border-color: ${chart.data.datasets[0].backgroundColor[i]} !important; width: 40px; height: 10px; display: inline-block; margin-right: 5px"></div>${item}</li>`;
                i++;
            });
            return ul.outerHTML;
        };

        this.Chart = new ChartJs(this.canvas.current.getContext('2d'), this.props.pieGraphContactedLeadsAverage);
        this.props.getAgentGraphPie(this.Chart, this.props.agentId, {
            companyIds: [],
            graphType: 'contacted',
            startDate: moment().startOf('month').format('Y-MM-DD'),
            endDate: moment().endOf('month').format('Y-MM-DD'),
        });

        this.Chart.data = this.props.pieGraphContactedLeadsAverage.data;
        this.Chart.update();
        this.refs.legend.innerHTML = this.Chart.generateLegend();
    }

    onChangeCompany = (event, data) => {
        this.setState({
            ...this.state,
            companyIds: data.value,
        });

        this.props.getAgentGraphPie(this.Chart, this.props.agentId, {
            companyIds: data.value,
            graphType: 'contacted',
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        });
    };

    onChangeDateFrom = (date) => {
        this.setState({
            ...this.state,
            startDate: moment(date).format('Y-MM-DD'),
            startDateDisplay: moment(date).format('MM/DD/Y'),
        });
    };

    onChangeDateTo = (date) => {
        this.setState({
            ...this.state,
            endDate: moment(date).format('Y-MM-DD'),
            endDateDisplay: moment(date).format('MM/DD/Y'),
        });

        this.props.getAgentGraphPie(this.Chart, this.props.agentId, {
            companyIds: this.state.companyIds,
            graphType: 'contacted',
            startDate: this.state.startDate,
            endDate: moment(date).format('Y-MM-DD'),
        });
    };

    onRestDate = () => {
        this.setState({
            ...this.state,
            startDateDisplay: moment().startOf('isoWeek').format('MM/DD/Y'),
            endDateDisplay: moment().endOf('isoWeek').format('MM/DD/Y'),
            startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
            endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
        });

        this.props.getAgentGraphPie(this.Chart, this.props.agentId, {
            companyIds: this.state.companyIds,
            graphType: 'contacted',
            startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
            endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
        });
    };

    onEditAgent = () => {
        this.props.loadForm({...this.props.agent, show: true})
    };

    onCloseSidebar () {
        document.getElementsByClassName('Leads sidebarOpened')[0].className = 'Leads';
        this.props.onClose();
        this.props.resetBreadCrumbToDefault();
        this.props.addBreadCrumb({
            name: 'Agents',
            path: '',
            active: true,
        });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // console.log('next', nextProps.s_agent.id);
        this.setState({agent: nextProps.s_agent});

        if(this.props.agentId !== nextProps.agentId) {
            let opt = this.props.pieGraphContactedLeadsAverage;
            opt.options.legendCallback = function (chart) {
                let ul = document.createElement('ul');
                let i = 0;
                chart.data.labels.forEach(function (item) {
                    ul.innerHTML += `<li style="display: inline; margin-right: 10px"><div style="background-color: ${chart.data.datasets[0].backgroundColor[i]}; width: 40px; height: 10px; display: inline-block; margin-right: 5px"></div>${item}</li>`;
                    i++;
                });
                return ul.outerHTML;
            };

            // this.Chart = new ChartJs(this.canvas.current.getContext('2d'), this.props.pieGraphContactedLeadsAverage);
            this.props.getAgentGraphPie(this.Chart, nextProps.agentId, {
                companyIds: [],
                graphType: 'contacted',
                startDate: this.state.startDate,
                endDate: this.state.endDate              
            });

            this.Chart.data = this.props.pieGraphContactedLeadsAverage.data;
            this.Chart.update();
            this.refs.legend.innerHTML = this.Chart.generateLegend();
        }
    }
    render() {
        const {data} = this.props.pieGraphContactedLeadsAverage.data.datasets[0];
        const {startDateDisplay, endDateDisplay, startDate, endDate} = this.state;
        const {avg_response_time} = this.props.pieGraphContactedLeadsAverage.data;
        return (<div className='AgentProfile'>
                    <div className="btnClose" onClick={this.onCloseSidebar.bind(this)}><i className="flaticon stroke x-2"></i></div>
                    <AgentModal/>
                    <Segment attached='top'>
                        <Grid.Column>
                            <div className="selectedAgent"> selected </div>
                            <div className="selectedName"> {this.state.agent.name} </div>
                            <div className="selectedContent1">
                                Inactive agents are not getting leads.
                            </div>
                            <div className="selectedContent2">
                                Assign them to an integration to activate.
                            </div>
                        </Grid.Column>                                                                                                        
                    </Segment>    
                    <Segment className='stats'>
                        <Popup position='bottom left'
                            trigger={
                                <Form.Field>
                                    <Button className="dateSelector">
                                        <i className="flaticon stroke calendar-3"></i>
                                        {startDateDisplay} - {endDateDisplay}
                                    </Button>
                                </Form.Field>} flowing hoverable>
                            <DatePickerSelect onChangeDateFrom={this.onChangeDateFrom}
                                            onChangeDateTo={this.onChangeDateTo}
                                            onRestDate={this.onRestDate}
                                            from={new Date(startDate)} to={new Date(endDate)}
                            />
                        </Popup>                        
                        <Form.Field
                            control={Select}
                            options={this.props.selectBoxAgentCompanies}
                            // label={{children: '', htmlFor: ''}}
                            placeholder='Select Company'
                            className = "dropdowncompany"
                            search
                            onChange={this.onChangeCompany}
                            // searchInput={{id: 'agents-list'}}
                        />
                        
                        <div className='average-response-time'>
                            <div className="time-to-contact">
                                Time to contact
                            </div>                                                                               
                            <div ref='legend'/>
                            <div className="chart-wrapper">
                                <canvas ref={this.canvas}/>
                                {R.sum(data) === 0 ? (<div className="empty-wrapper"/>) : null}
                            </div>
                            <div className='average-response-time-label'><p>AVR response time</p> {avg_response_time}</div>                    
                        </div>
                    </Segment>            
                </div>)
    }
}

export default compose(AgentFormContainer, BreadCrumbContainer, AgentsContainer)(AgentProfile);
