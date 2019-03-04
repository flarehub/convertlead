import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  Segment, Grid, Button, Select, Form, Header, Menu
} from 'semantic-ui-react';
import styles from './index.scss';
import {AgentsContainer, CompaniesContainer} from "@containers";
import ChartJs from 'chart.js';

const agents = [
  { key: null, text: 'All agents', value: null },
];

class CompanyProfile extends Component {

  constructor(props) {
    super(props);
    this.companyId = this.props.match.params.companyId;
    this.canvas = React.createRef();
  }

  componentWillMount() {
    const { companyId } = this.props.match.params;
    this.props.getCompanyBy(companyId);
    this.props.loadSelectBoxAgents({
      companyId
    });
  }

  componentDidMount() {
    this.Chart =  new ChartJs(this.canvas.current.getContext('2d'),
      this.props.graphContactedLeadsAverage);
    this.props.getCompanyGraph(this.Chart, this.companyId, {
      graphType: 'contacted',
      startDate: '2019-01-01',
      endDate: '2019-03-31',
    });

    this.Chart.data = this.props.graphContactedLeadsAverage.data;
    this.Chart.update();
  }

  onChangeAgent = (event, data) => {
    this.props.getCompanyGraph(this.Chart, this.companyId, {
      agentId: data.value,
      graphType: 'contacted',
      startDate: '2019-01-01',
      endDate: '2019-03-31',
    });
  };

  render() {
    return (<div className={styles.CompanyProfile}>
      <Segment attached='top'>
        <Grid columns={2}>
          <Grid.Column>
            <Header floated='left' as='h1'>Company</Header>
            <Form.Field
              loading={!this.props.selectBoxAgents.length}
              control={Select}
              options={[...agents, ...this.props.selectBoxAgents]}
              label={{ children: 'Filter', htmlFor: 'agents-list' }}
              placeholder='Company agents'
              search
              onChange={this.onChangeAgent}
              searchInput={{ id: 'agents-list' }}
            />
          </Grid.Column>
          <Grid.Column>
            <Menu secondary>
              <Menu.Menu position='right'>
                <Button color='teal' content='edit Company' icon='add' labelPosition='left' />
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
        <Segment basic>
          <canvas ref={this.canvas}></canvas>
        </Segment>
      </Segment>
    </div>)
  }
}

export default compose(CompaniesContainer, AgentsContainer)(CompanyProfile);