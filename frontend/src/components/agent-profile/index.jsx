import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  Segment, Grid, Button, Select, Form, Header, Menu, Popup, Icon
} from 'semantic-ui-react';
import './index.scss';
import { AgentsContainer, BreadCrumbContainer, AgentFormContainer } from "@containers";
import ChartJs from 'chart.js';
import DatePickerSelect from "components/@common/datepicker";
import * as moment from 'moment';
import AgentModal from '../@common/modals/agent';
import {Auth} from "@services";

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
    this.agentId = this.props.match.params.agentId;
    this.canvas = React.createRef();
  }

  componentWillMount() {
    const { agentId } = this.props.match.params;
    this.props.getAgent(agentId, true);
  }

  componentDidMount() {
    this.Chart =  new ChartJs(this.canvas.current.getContext('2d'),
      this.props.graphContactedLeadsAverage);
    this.props.getAgentGraph(this.Chart, this.agentId, {
      companyIds: this.state.companyIds,
      graphType: 'contacted',
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    });

    this.Chart.data = this.props.graphContactedLeadsAverage.data;
    this.Chart.update();

    this.props.addBreadCrumb({
      name: 'Agents',
      path: '/agents',
    });
  }

  onChangeCompany = (event, data) => {
    this.setState({
      ...this.state,
      companyIds: data.value,
    });

    this.props.getAgentGraph(this.Chart, this.agentId, {
      companyIds: data.value,
      graphType: 'contacted',
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    });
  };

  onChangeDateFrom = (date) => {
    this.setState({
      ...this.state,
      startDate:  moment(date).format('Y-MM-DD'),
      startDateDisplay:  moment(date).format('MM/DD/Y'),
    });
  };

  onChangeDateTo = (date) => {
    this.setState({
      ...this.state,
      endDate:  moment(date).format('Y-MM-DD'),
      endDateDisplay:  moment(date).format('MM/DD/Y'),
    });

    this.props.getAgentGraph(this.Chart, this.agentId, {
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

    this.props.getAgentGraph(this.Chart, this.agentId, {
      companyIds: this.state.companyIds,
      graphType: 'contacted',
      startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
      endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
    });
  };

  onEditAgent = () => {
    this.props.loadForm({ ...this.props.agent, show: true })
  };

  render() {
    const { startDateDisplay, endDateDisplay, startDate, endDate } = this.state;
    const { agent } = this.props;
    return (<div className='AgentProfile'>
      <AgentModal />
      <Segment attached='top'>
        <Grid>
          <Grid.Column>
            <Header floated='left' as='h1'>Agent profile</Header>
          </Grid.Column>
        </Grid>
        <Grid columns={2}>
          <Grid.Column>
            <Form>
              <Form.Group widths='equal'>
                {
                  Auth.isAgency ? <Form.Field
                    loading={!this.props.selectBoxAgentCompanies.length}
                    control={Select}
                    options={this.props.selectBoxAgentCompanies}
                    label={{ children: '', htmlFor: 'agents-list' }}
                    placeholder='Agent companies'
                    search
                    multiple
                    defaultValue={this.props.agentCompaniesIds || null}
                    onChange={this.onChangeCompany}
                    searchInput={{ id: 'agents-list' }}
                  />
                    : null
                }
                <Popup position='bottom left'
                       trigger={
                         <Form.Field>
                           <Button>
                             <Icon name='calendar alternate outline' />
                                {startDateDisplay} - {endDateDisplay}
                            </Button>
                         </Form.Field>} flowing hoverable>

                  <DatePickerSelect onChangeDateFrom={this.onChangeDateFrom}
                                    onChangeDateTo={this.onChangeDateTo}
                                    onRestDate={this.onRestDate}
                                    from={new Date(startDate)} to={new Date(endDate)}
                  />
                </Popup>
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Menu secondary>
              <Menu.Menu position='right'>
                <Button color='teal' content='Edit Agent' onClick={this.onEditAgent} icon='pencil alternate' labelPosition='left' />
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
        <Segment className='average-response-time' basic>
          <canvas ref={this.canvas}></canvas>
          <label className='average-response-time-label'>Average response time: {this.props.averageResponseTime}</label>
        </Segment>

      </Segment>
    </div>)
  }
}

export default compose(AgentFormContainer, BreadCrumbContainer, AgentsContainer)(AgentProfile);