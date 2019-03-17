import React, { Component } from 'react';
import {
  BreadCrumbContainer,
  LeadsContainer,
  LeadNotesContainer
} from "@containers";
import { compose } from 'recompose';
import * as R from 'ramda';
import { Button, Icon, Form, TextArea, Dropdown } from 'semantic-ui-react';
import { LeadNoteTimeLine } from './timeline';

class AgentLeadNotes extends Component {
  state = {
    showTimeline: true,
    lead: {
      email: '',
      phone: '',
    },
    form: {
      status: '',
      message: ''
    }
  };

  componentWillMount() {
    const lead = R.path(['history', 'location', 'state', 'lead'], this.props);
    this.setState({
      ...this.state,
      lead,
    });

    this.props.addBreadCrumb({
      name: 'Leads',
      path: '/companies/leads'
    }, true);
    this.props.addBreadCrumb({
      name: lead.fullname,
      path: '',
      active: true,
    }, false);

    this.props.loadLead(lead.company.id, lead.id, true);
  }

  onCall = () => {
    this.props.createLeadNote({
      message: 'Lead have been called!',
      status: 'CONTACTED_CALL'
    });
  };

  onEmail = () => {
    this.props.createLeadNote({
      message: 'Lead contacted by email!',
      status: 'CONTACTED_EMAIL'
    });
  };

  onText = () => {
    this.props.createLeadNote({
      message: 'Lead contacted by SMS!',
      status: 'CONTACTED_SMS'
    });
  };

  toggleTimeline = () => {
    this.setState({
      ...this.state,
      showTimeline: !this.state.showTimeline
    })
  };

  onChange = (event, data) => {
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [data.name]: data.value
      }
    })
  };

  onAddNote = () => {
    this.props.createLeadNote({
      ...this.state.form,
      status: this.state.form.status ? this.state.form.status : this.props.lead.status
    });
  };

  render() {
    const { lead, showTimeline } = this.state;
    const { leadNotes, leadStatuses } = this.props;
    return (<div className='AgentLeadNotes'>
      <div className='lead-profile-row'>
        <Button as='a' href={`tel:${lead.phone}`} onClick={this.onCall} circular>
          <Icon name='call' />
          Call
        </Button>
        <Button as='a' href={`mailto:${lead.email}`} onClick={this.onEmail} circular>
          <Icon name='mail' />
          E-mail
        </Button>
        <Button circular onClick={this.onText}>
          <Icon name='pencil alternate' />
          Text
        </Button>
      </div>
      <div className='lead-info'>
        <h2>Subscribed for:</h2>
        <label>{lead.campaign.name}</label>
      </div>
      <div className='lead-timeline'>
        <div className='timeline-header' onClick={this.toggleTimeline}>Additional Info <Icon name={
          (showTimeline ? 'angle down' : 'angle up')
        }></Icon></div>
        {
          showTimeline ? <LeadNoteTimeLine notes={leadNotes} /> : null
        }
      </div>
      <div className='addLeadNote'>
        <Form>
          <Form.Field>
            <TextArea name='message' onChange={this.onChange} />
          </Form.Field>
        <Button.Group>
          <Button onClick={this.onAddNote} positive>Submit</Button>
          <Button.Or />
          <Dropdown options={leadStatuses} name='status' onChange={this.onChange} floating button className='icon' defaultValue={lead.status} />
        </Button.Group>
        </Form>
      </div>
    </div>);
  }
}

export default compose(
  LeadsContainer,
  LeadNotesContainer,
  BreadCrumbContainer)(AgentLeadNotes);