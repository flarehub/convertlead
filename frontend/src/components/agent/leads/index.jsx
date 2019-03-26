import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { LeadsContainer, BreadCrumbContainer } from '@containers';
import { Tab, Menu, Label, Button, Segment } from 'semantic-ui-react';
import './index.scss'
import LeadsList from "./list";

class AgentLeads extends Component {
  state = {
    scrollY: window.scrollY,
  };

  componentWillMount() {
    this.props.agentLeadsByStatuses([]);
    this.props.addBreadCrumb({
      name: 'Leads',
      path: '/agents',
      active: true,
    });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { pagination } = this.props;
    if (window.scrollY > this.state.scrollY && pagination.current_page < pagination.last_page) {
      this.props.scrollToPage(pagination.current_page + 1);
      this.setState({
        scrollY: window.scrollY,
      });
    }
  }

  showAllLeads = () => {
    this.setState({
      pageStart: 0,
    });
    this.props.agentLeadsByStatuses([]);
  };

  showFreshLeads = () => {
    this.setState({
      pageStart: 0,
    });
    this.props.agentLeadsByStatuses(['NEW']);
  };

  showContactedLeads = () => {
    this.setState({
      pageStart: 0,
    });
    this.props.agentLeadsByStatuses(['CONTACTED_SMS', 'CONTACTED_CALL', 'CONTACTED_EMAIL']);
  };

  showSoldLeads = () => {
    this.setState({
      pageStart: 0,
    });
    this.props.agentLeadsByStatuses(['SOLD']);
  };

  render() {
    const { agentLeads, statuses, newLeadsCount } = this.props;
    const panes =  [
      { menuItem: (
          <Menu.Item key='all' onClick={this.showAllLeads}>
            All
          </Menu.Item>
        ), render: () => <LeadsList statuses={statuses} leads={agentLeads} /> },
      { menuItem: (
          <Menu.Item key='fresh' onClick={this.showFreshLeads}>
            Fresh<Label>{newLeadsCount}</Label>
          </Menu.Item>
        ), render: () => <LeadsList statuses={statuses} leads={agentLeads} /> },
      { menuItem: (
          <Menu.Item key='contacted' onClick={this.showContactedLeads}>
            Contacted
          </Menu.Item>
        ), render: () => <LeadsList statuses={statuses} leads={agentLeads} /> },
      { menuItem: (
          <Menu.Item key='soldout' onClick={this.showSoldLeads}>
            Sold
          </Menu.Item>
        ), render: () => <LeadsList statuses={statuses} leads={agentLeads} /> },
    ];
    return (<div className='AgentLeads'>
      <Segment basic>
        <h1 className="ui left floated header mobile-app-menu">Leads</h1>
      </Segment>
      <Segment basic>
        <Tab menu={{ secondary: true }} panes={panes} />
      </Segment>
      <Link to='/companies/leads/create'>
        <Button circular primary size='massive' icon='plus' className='add-lead' />
      </Link>
    </div>)
  }
}

export default compose(LeadsContainer, BreadCrumbContainer)(AgentLeads);