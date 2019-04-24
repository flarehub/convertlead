import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {compose} from 'recompose';
import {
    Segment, Grid, Button, Select, Form
} from 'semantic-ui-react';
import './index.scss';
import {AgentsContainer, ProfileContainer, BreadCrumbContainer} from "@containers";
import ChartJs from 'chart.js';
import * as moment from 'moment';
import * as R from 'ramda';

class LeadStats extends Component {
    state = {
        dates: {
            'today': {
                startDate: moment().startOf('day').format('Y-MM-DD'),
                endDate: moment().endOf('day').format('Y-MM-DD'),
            },
            'yesterday': {
                startDate: moment().subtract(1, 'days').startOf('day').format('Y-MM-DD'),
                endDate: moment().subtract(1, 'days').endOf('day').format('Y-MM-DD'),
            },
            'this-week': {
                startDate: moment().startOf('week').format('Y-MM-DD'),
                endDate: moment().endOf('week').format('Y-MM-DD'),
            },
            'previous-week': {
                startDate: moment().subtract(1, 'week').startOf('week').format('Y-MM-DD'),
                endDate: moment().subtract(1, 'week').endOf('week').format('Y-MM-DD'),
            },
            'this-month': {
                startDate: moment().startOf('month').format('Y-MM-DD'),
                endDate: moment().endOf('month').format('Y-MM-DD'),
            },
            'previous-month': {
                startDate: moment().subtract(1, 'month').startOf('month').format('Y-MM-DD'),
                endDate: moment().subtract(1, 'month').endOf('month').format('Y-MM-DD'),
            },
        }
    };

    constructor(props) {
        super(props);
        this.agentId = this.props.profile.id;
        this.canvas = React.createRef();
    }

    componentDidMount() {

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

        this.Chart = new ChartJs(this.canvas.current.getContext('2d'), this.props.pieGraphContactedLeadsAverage);
        this.props.getAgentGraphPie(this.Chart, this.agentId, {
            companyIds: [],
            graphType: 'contacted',
            startDate: this.state.dates.today.startDate,
            endDate: this.state.dates.today.endDate,
        });

        this.Chart.data = this.props.pieGraphContactedLeadsAverage.data;
        this.Chart.update();
        this.refs.legend.innerHTML = this.Chart.generateLegend();
        console.log(this.state.dates);
        console.log(this.Chart);
    }

    onChangeDate = (event, data) => {
        this.props.getAgentGraphPie(this.Chart, this.agentId, {
            companyIds: data.value,
            graphType: 'contacted',
            startDate: this.state.dates[data.value].startDate,
            endDate: this.state.dates[data.value].endDate,
        });
    };

    render() {
        const {data} = this.props.pieGraphContactedLeadsAverage.data.datasets[0];
        return (<div className='LeadsStats'>
            <Segment attached='top'>
                <Grid columns={2}>
                    <Grid.Column>
                        <h1 className="ui left floated header mobile-app-menu">Dashboard</h1>
                    </Grid.Column>
                    <Grid.Column>

                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field
                                    required
                                    loading={!this.props.selectBoxDates.length}
                                    control={Select}
                                    options={this.props.selectBoxDates || []}
                                    placeholder="Select Date"
                                    defaultValue='today'
                                    onChange={this.onChangeDate}
                                    searchInput={{id: 'graph-date'}}
                                />
                            </Form.Group>
                        </Form>

                    </Grid.Column>
                </Grid>
                <Segment className='average-response-time' basic>
                    <div ref='legend'/>
                    <div className="chart-wrapper">
                        <canvas ref={this.canvas}/>
                        { R.sum(data)===0? (<div className="empty-wrapper"/>) : null}
                    </div>

                    <div className='agent-welcome'>
                        <h3>Hi {this.props.profile.name}</h3>
                        <p>
                            Looks like you've started calling your leads. You can see your stats on this page. Click
                            below to check your new leads.
                        </p>
                        <Link to='/companies/leads'>
                            <Button primary>View fresh leads</Button>
                        </Link>
                    </div>
                </Segment>

            </Segment>
        </div>)
    }
}

export default compose(ProfileContainer, BreadCrumbContainer, AgentsContainer)(LeadStats);