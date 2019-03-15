import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import {
  Segment, Grid, Button, Select, Form
} from 'semantic-ui-react';
import './index.scss';
import { AgentsContainer, ProfileContainer, BreadCrumbContainer } from "@containers";
import ChartJs from 'chart.js';
import * as moment from 'moment';

class LeadStats extends Component {
  state = {
    dates: {
      today: {
        startDate: moment().startOf('day').format('Y-MM-DD'),
        endDate: moment().endOf('day').format('Y-MM-DD'),
      },
      yesterday: {
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
    this.Chart =  new ChartJs(this.canvas.current.getContext('2d'), this.props.pieGraphContactedLeadsAverage);
    this.props.getAgentGraphPie(this.Chart, this.agentId, {
      companyIds: [],
      graphType: 'contacted',
      startDate: this.state.dates.today.startDate,
      endDate: this.state.dates.today.endDate,
    });

    this.Chart.data = this.props.pieGraphContactedLeadsAverage.data;
    this.Chart.update();
    console.log(this.state.dates);
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
    return (<div className='LeadsStats'>
      <Segment attached='top'>
        <Grid columns={2}>
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
                  searchInput={{ id: 'graph-date' }}
                />
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column>
          </Grid.Column>
        </Grid>
        <Segment className='average-response-time' basic>
          <canvas ref={this.canvas}></canvas>
          <div className='agent-welcome'>
            <h3>Hi {this.props.profile.name}</h3>
            <p>
              Looks like you've started your leads. You can see... this page. Click below to see new leads.
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