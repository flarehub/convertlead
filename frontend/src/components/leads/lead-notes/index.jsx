import React, {Component} from 'react';
import {compose} from 'recompose';
import { Accordion, Icon, Segment, Button, Grid, Header } from 'semantic-ui-react';
import { BreadCrumbContainer, LeadNotesContainer, LeadFormContainer, LeadsContainer } from "@containers";
import TimeLine from "./timeline";
import Loader from 'components/loader';
import './index.scss';
import LeadModal from 'components/@common/modals/lead';
import {config} from '@services';

class LeadNotes extends Component {
    state = {
        activeIndex: null,
    };

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

    exportToPDF = (companyId, leadId) => {
        this.props.exportToPDF(companyId, leadId);
    };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex })
    };

    render() {
        const {lead, leadNotes, leadStatuses} = this.props;
        const { activeIndex } = this.state;
        return (
            <div className='LeadNotes'>
                <LeadModal size='small'/>
                <Grid.Column width={6}>
                    <Segment className='lead-profile'>
                        <div className='lead-profile-row'>
                            <div className={`timeline-status timeline-bg-color-${lead.status.charAt(0).toLowerCase()}`}>
                                <span>{(lead.fullname && lead.fullname.charAt(0)) || lead.status.charAt(0)}</span>
                            </div>
                            <div className='lead-profile-value fullname'>{lead.fullname}</div>

                            <Grid.Column  style={{textAlign: 'center'}}>
                                <div className={'ui secondary menu leadnotes'}>
                                    <Button circular className='email'
                                            icon='icon-email'   as='a' href={`mailto:${lead.email}`}/>

                                    <Button circular className='editlead'
                                            icon='icon-pencil'  onClick={this.props.loadForm.bind(this, {
                                        ...lead,
                                        company_id: lead.company.id,
                                        show: true
                                    })}/>
                                    <Button circular className='newlead'
                                            icon='icon-add '
                                            onClick={this.props.loadForm.bind(this, {show: true})}/>
                                </div>
                            </Grid.Column>

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
                        <div className='lead-profile-row additionalinfo'>
                            <Accordion>
                                <Accordion.Title
                                  className='lead-profile-label-additional'
                                  active={activeIndex === 0}
                                  index={0}
                                  onClick={this.handleClick}
                                >
                                    <Icon name='dropdown' />
                                    Additional information
                                </Accordion.Title>
                                <Accordion.Content
                                  className='lead-profile-row'
                                  active={activeIndex === 0}>
                                    <p>
                                        {lead.metadata}
                                    </p>
                                </Accordion.Content>
                            </Accordion>
                        </div>
                        </div>
                    </Segment>
                </Grid.Column>

                <Segment attached='top' className='pagehead'>
                    <Grid.Column floated='left' style={{textAlign: 'left'}}>
                        <Header floated='left' as='h1'>Lead timeline</Header>

                    </Grid.Column>
                </Segment>

                <Segment attached='top'>


                    <Segment basic className={"notoppad"}>
                        <Loader/>

                        <div className="export-data">Export your data
                            <a href={`${config.get('REACT_APP_API_SERVER')}/v1/leads/${lead.id}/export-csv`}>.csv export</a>
                            <a href={`${config.get('REACT_APP_API_SERVER')}/v1/leads/${lead.id}/export-pdf`}>.pdf export</a>
                        </div>

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

export default compose(BreadCrumbContainer, LeadsContainer, LeadNotesContainer, LeadFormContainer)(LeadNotes);