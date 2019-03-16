import React, { Component } from 'react';
import { compose } from 'recompose';
import { LeadsContainer } from '@containers';
import { Tab, Menu, Label } from 'semantic-ui-react';
import './index.scss'
import LeadsList from "./list";

class AgentLeads extends Component {

  componentWillMount() {
    this.props.loadLeads();
  }

  showAllLeads = () => {
    this.props.loadLeads();
  };

  showFreshLeads = () => {
    this.props.filterLeads({
      statuses: ['NEW']
    });
  };

  showContactedLeads = () => {
    this.props.filterLeads({
      statuses: ['CONTACTED_SMS', 'CONTACTED_CALL', 'CONTACTED_EMAIL']
    });
  };

  showSoldLeads = () => {
    this.props.filterLeads({
      statuses: ['SOLD']
    });
  };

  render() {
    const { leads, statuses } = this.props;
    const panes =  [
      { menuItem: (
          <Menu.Item key='all' onClick={this.showAllLeads}>
            All
          </Menu.Item>
        ), render: () => <LeadsList statuses={statuses} leads={leads} /> },
      { menuItem: (
          <Menu.Item key='fresh' onClick={this.showFreshLeads}>
            Fresh<Label>15</Label>
          </Menu.Item>
        ), render: () => <LeadsList statuses={statuses} leads={leads} /> },
      { menuItem: (
          <Menu.Item key='contacted' onClick={this.showContactedLeads}>
            Contacted
          </Menu.Item>
        ), render: () => <LeadsList statuses={statuses} leads={leads} /> },
      { menuItem: (
          <Menu.Item key='soldout' onClick={this.showSoldLeads}>
            Sold
          </Menu.Item>
        ), render: () => <LeadsList statuses={statuses} leads={leads} /> },
    ];
    return (<div className='AgentLeads'>
      <Tab menu={{ secondary: true }} panes={panes} />
    </div>)
  }
}

export default compose(LeadsContainer)(AgentLeads);