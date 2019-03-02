import React, { Component } from 'react';
import { compose } from 'recompose';
import { Segment, Button, Icon, List, Grid, Image } from 'semantic-ui-react';
import styles from './index.scss';
import { BreadCrumbContainer, LeadNotesContainer } from "@containers";
import TimeLine from "./timeline";

class LeadNotes extends Component {

  async componentWillMount() {
    const { companyId, leadId } = this.props.match.params;
    this.props.loadLead(companyId, leadId);
    this.props.addBreadCrumb({
      name: 'Leads',
      path: '/leads'
    });
  }

  render() {
    const { lead, leadNotes } = this.props;
    return (<div className={styles.LeadNotes}>
      <Segment>
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column width={6}>
              <Segment className='lead-profile' basic>
                <div className='lead-profile-row'>
                  <div className='lead-profile-label'><label>Phone</label></div>
                  <div className='lead-profile-value'>{lead.phone}</div>
                </div>
                <div className='lead-profile-row'>
                  <div className='lead-profile-label'><label>Fullname</label></div>
                  <div className='lead-profile-value'>{lead.fullname}</div>
                </div>
                <div className='lead-profile-row'>
                  <div className='lead-profile-label'><label>Email</label></div>
                  <div className='lead-profile-value'>{lead.email}</div>
                </div>
                <div className='lead-profile-row'>
                  <Button as='a' href={`tel:${lead.phone}`} circular>
                    <Icon name='call' />
                    Call
                  </Button>
                  <Button as='a' href={`mailto:${lead.email}`} circular>
                    <Icon name='mail' />
                    E-mail
                  </Button>
                  <Button circular>
                    <Icon name='pencil alternate' />
                    Text
                  </Button>
                </div>
                <div className='lead-profile-row'>
                  <div className='lead-profile-label'><label>Deal</label></div>
                  <div className='lead-profile-value'>{lead.name}</div>
                </div>
                <div className='lead-profile-row'>
                  <div className='lead-profile-label'><label>Source</label></div>
                  <div className='lead-profile-value'>{lead.campaign.name}</div>
                </div>
                <div className='lead-profile-row'>
                  <div className='lead-profile-label'><label>Assigned to</label></div>
                  <div className='lead-profile-value'>{lead.agent.name}</div>
                </div>
                <div className='lead-profile-row'>
                  <div className='lead-profile-label'><label>Company</label></div>
                  <div className='lead-profile-value'>{lead.company.name}</div>
                </div>
                <div className='lead-profile-row'>
                  <div className='lead-profile-label'><label>Additional information:</label></div>
                  <div className='lead-profile-value'></div>
                </div>
                <div className='lead-profile-row'>
                  <div className='lead-profile-value'>{lead.metadata}</div>
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column textAlign='left'>
              <TimeLine notes={leadNotes} lead={lead} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>)
  }
}

export default compose(BreadCrumbContainer, LeadNotesContainer)(LeadNotes);