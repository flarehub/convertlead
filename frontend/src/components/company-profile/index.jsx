import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  Segment, Grid, Button, Select, Form, Header, Menu
} from 'semantic-ui-react';
import styles from './index.scss';
import {AgentsContainer, CompaniesContainer} from "@containers";

const agents = [
  { key: null, text: 'All agents', value: null },
];

class CompanyProfile extends Component {

  componentWillMount() {
    const { companyId } = this.props.match.params;
    this.props.getCompanyBy(companyId);
    this.props.loadSelectBoxAgents({
      companyId
    });
  }

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
        </Segment>
      </Segment>
    </div>)
  }
}

export default compose(CompaniesContainer, AgentsContainer)(CompanyProfile);