import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  Segment, Grid, Button, Select, Form, Header, Menu, Popup, Icon
} from 'semantic-ui-react';
import './index.scss';
import { AgentsContainer, ProfileContainer, BreadCrumbContainer, CompaniesContainer, CompanyFormContainer } from "@containers";
import ChartJs from 'chart.js';
import DatePickerSelect from "components/@common/datepicker";
import * as moment from 'moment';
import CompanyModal from '../@common/modals/company';
import {Auth} from "@services";

const agents = [
  { key: null, text: 'All agents', value: null },
];

class CompanyProfile extends Component {
  state = {
    agentId: '',
    startDateDisplay: moment().startOf('isoWeek').format('MM/DD/Y'),
    endDateDisplay: moment().endOf('isoWeek').format('MM/DD/Y'),
    startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
    endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
  };

  constructor(props) {
    super(props);
    this.companyId = this.props.match.params.companyId;
    this.canvas = React.createRef();
  }

  componentWillMount() {
    const { companyId } = this.props.match.params;
    this.props.loadSelectBoxAgents({
      companyId
    });
    if (Auth.isAgency) {
      this.props.addBreadCrumb({
        name: 'Companies',
        path: '/companies',
      });
      this.props.getCompanyBy(companyId, true);
    } else {
      this.props.addBreadCrumb({
        name: 'Statistics',
        path: '',
        active: true
      });
    }
    console.log(this.props);
  }

  componentDidMount() {

    let opt = this.props.graphContactedLeadsAverage;
    opt.options.legendCallback = function(chart) {
      let ul = document.createElement('ul');
      chart.data.datasets.forEach(function(item) {
        ul.innerHTML += `<li style="display: inline; margin-right: 10px"><div style="background-color: ${item['backgroundColor']}; border: ${item['borderColor']} solid ${item['borderWidth']}px; width: 40px; height: 10px; display: inline-block; margin-right: 5px"></div>${item['label']}</li>`;
      });
      return ul.outerHTML;
    };

    this.Chart =  new ChartJs(this.canvas.current.getContext('2d'), this.props.graphContactedLeadsAverage);
    this.props.getCompanyGraph(this.Chart, this.companyId, {
      graphType: 'contacted',
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    });

    this.Chart.data = this.props.graphContactedLeadsAverage.data;
    this.Chart.update();
    this.refs.legend.innerHTML = this.Chart.generateLegend();
  }

  onChangeAgent = (event, data) => {
    this.setState({
      ...this.state,
      agentId: data.value,
    });

    this.props.getCompanyGraph(this.Chart, this.companyId, {
      agentId: this.state.agentId,
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

    this.props.getCompanyGraph(this.Chart, this.companyId, {
      agentId: this.state.agentId,
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

    this.props.getCompanyGraph(this.Chart, this.companyId, {
      agentId: this.state.agentId,
      graphType: 'contacted',
      startDate: moment().startOf('isoWeek').format('Y-MM-DD'),
      endDate: moment().endOf('isoWeek').format('Y-MM-DD'),
    });
  };

  onEditCompany = () => {
    this.props.loadForm({ ...this.props.profile, show: true })
  };

  render() {
    const { startDateDisplay, endDateDisplay } = this.state;
    const { companyAverageResponseTime } = this.props;
    return (<div className='CompanyProfile'>
      {
        Auth.isAgency ? <CompanyModal /> : null
      }
      <Segment attached='top'>
       
               
        <Grid columns={2}>
          <Grid.Column>
          
          <Header floated='left' as='h1'>
              {
                Auth.isAgency ? 'Company' : 'Statistic'
              }
              </Header>
                            
            <Form>
              <Form.Group widths='equal'>
                <Form.Field
                  loading={!this.props.selectBoxAgents.length}
                  control={Select}
                  options={[...agents, ...this.props.selectBoxAgents]}
                  label={{ children: '', htmlFor: 'agents-list' }}
                  placeholder='Company agents'
                  search
                  onChange={this.onChangeAgent}
                  searchInput={{ id: 'agents-list' }}
                />
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
                                    from={new Date(this.state.startDate)} to={new Date(this.state.endDate)}
                  />
                </Popup>
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Menu secondary>
              <Menu.Menu position='right'>
                {
                  Auth.isAgency
                    ? <Button color='teal' content='Edit Company' onClick={this.onEditCompany} labelPosition='left' />
                    : null
                }
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
        <Segment className='average-response-time' basic>
          <div ref='legend'></div>
          <canvas ref={this.canvas}></canvas>
          <label className='average-response-time-label'>Average response time: {companyAverageResponseTime}</label>
        </Segment>
      </Segment>
    </div>)
  }
}

export default compose(AgentsContainer, CompaniesContainer, ProfileContainer, CompanyFormContainer, BreadCrumbContainer)(CompanyProfile);