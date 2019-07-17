import React, {Component} from 'react';
import {compose} from 'recompose';
import {Segment, Button, Icon, Grid, Header} from 'semantic-ui-react';
import {BreadCrumbContainer, LeadNotesContainer, LeadFormContainer} from "@containers";
import TimeLine from "./timeline";
import Loader from 'components/loader';
import './index.scss';
import LeadModal from "../../@common/modals/lead";

class LeadNotes extends Component {

    async componentWillMount() {
        const {companyId, leadId} = this.props.match.params;
        this.props.loadLead(companyId, leadId);
        this.props.addBreadCrumb({
            name: 'Leads',
            path: '/leads'
        });
    }

    onAddNote = form => {
        this.props.createLeadNote({
            ...form,
            status: form.status ? form.status : this.props.lead.status
        });
    };


    render() {
        const {lead, leadNotes, leadStatuses} = this.props;
        return (
            <div className='LeadNotes'>
                <LeadModal size='small'/>
                <Grid.Column width={6}>
                    <Segment className='lead-profile'>
                        <div className='lead-profile-row'>

                            <div className='lead-profile-value fullname'>{lead.fullname}</div>
                            <div
                                className={`block timeline-status timeline-bg-color-${lead.status.charAt(0).toLowerCase()}`}/>
                        </div>
                        <div className='lead-profile-row'>
                            <div className='lead-profile-label'><label>Phone</label></div>
                            <div className='lead-profile-value'>{lead.phone}</div>
                        </div>
                        <div className='lead-profile-row'>
                            <div className='lead-profile-label'><label>Email</label></div>
                            <div className='lead-profile-value'>{lead.email}</div>
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
                            <div className='lead-profile-value'/>
                        </div>
                        <div className='lead-profile-row'>
                            <p>{lead.metadata}</p>
                        </div>
                    </Segment>
                </Grid.Column>

                <Segment attached='top'>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column floated='left' style={{textAlign: 'left'}}>
                                <Header floated='left' as='h1'>Lead timeline</Header>
                                <Button content='Send e-mail' as='a' href={`mailto:${lead.email}`}/>
                            </Grid.Column>
                            <Grid.Column floated='right' style={{textAlign: 'right'}}>
                                <div className={'right floated ui secondary menu'}>
                                    <Button content='Edit lead' onClick={this.props.loadForm.bind(this, {
                                        ...lead,
                                        company_id: lead.company.id,
                                        show: true
                                    })}/>
                                    <Button color='teal' content='New Lead'
                                            onClick={this.props.loadForm.bind(this, {show: true})}/>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Segment basic className={"notoppad"}>
                        <Loader/>

                        <div className="export-data">Export your data <a href="">.csv export</a> <a href="">.pdf
                            export</a></div>

                        <Grid columns='equal'>
                            <Grid.Row>

                                <Grid.Column textAlign='left'>
                                    <Segment basic>
                                        <TimeLine notes={leadNotes} lead={lead} onAddNote={this.onAddNote}
                                                  leadStatuses={leadStatuses}/>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Segment>
            </div>
        )
    }
}

export default compose(BreadCrumbContainer, LeadNotesContainer, LeadFormContainer)(LeadNotes);