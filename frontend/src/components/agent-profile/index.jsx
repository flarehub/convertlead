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

class AgentProfile extends Component {
    
    state = {
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
        disableAutoComplete();

        let opt = this.props.pieGraphContactedLeadsAverage;
        opt.options.legendCallback = function (chart) {
            let ul = document.createElement('ul');
            let i = 0;
            chart.data.labels.forEach(function (item) {
                ul.innerHTML += `<li style="display: inline; margin-right: 10px"><div style="background-color: ${chart.data.datasets[0].backgroundColor[i]}; width: 40px; height: 10px; display: inline-block; margin-right: 5px"></div>${item}</li>`;
                //ul.innerHTML +=`<div style="background-color: ${chart.data.datasets[0].backgroundColor[i]}; width: 40px; height: 10px; display: inline-block; margin-right: 5px"></div><div>${item}</div>`;
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

        this.props.getAgentGraph(this.Chart, this.props.agentId, {
            companyIds: this.state.companyIds,
            graphType: 'contacted',
            startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
            endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
        });
    };

    onEditAgent = () => {
        this.props.loadForm({...this.props.agent, show: true})
    };

    // onMouseLeave = () => {
    //     if (typeof this.props.onClose !== 'undefined') {
    //         this.props.onClose();
    //     }
    // }
    onCloseSidebar () {
        this.props.onClose();
    }
    render() {
        const {data} = this.props.pieGraphContactedLeadsAverage.data.datasets[0];
        const {startDateDisplay, endDateDisplay, startDate, endDate} = this.state;
        //return (<div className='AgentProfile' onMouseLeave={this.onMouseLeave}>
        return (<div className='AgentProfile'>
                    <div className="btnClose" onClick={this.onCloseSidebar.bind(this)}>x</div>
                    <AgentModal/>
                    <Segment attached='top'>
                        <Grid.Column>
                            <div className="selectedAgent"> selected </div>
                            <div className="selectedName"> Jone Doe </div>
                            <div className="selectedContent1">
                                Inactive agents are not getting leads.
                            </div>
                            <div className="selectedContent2">
                                Assign it to an integration to active.
                            </div>
                        </Grid.Column>                                                                                                        
                    </Segment>    
                    <Segment>
                        <Popup position='bottom left'
                            trigger={
                                <Form.Field>
                                    <Button className="dateSelector">
                                        <Icon name='calendar alternate outline'/>
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
                            <div className='average-response-time-label'>AVR response time: {R.sum(data)}</div>                    
                        </div>
                        </Segment>            
                    </div>)
    }
}

export default compose(AgentFormContainer, BreadCrumbContainer, AgentsContainer)(AgentProfile);
