import React, {Component} from 'react';
import {compose} from 'recompose';
import {Segment, Button, Grid, Icon} from 'semantic-ui-react';
import { BreadCrumbContainer, LeadNotesContainer, LeadFormContainer, LeadsContainer } from "@containers";
import TimeLine from "./timeline";
import './index.scss';
import LeadModal from 'components/@common/modals/lead';
import {Link} from "react-router-dom";

class LeadNotes extends Component {

    async componentWillMount() {
        const {companyId, leadId} = this.props;
        this.props.loadLead(companyId, leadId, true);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.leadId !== this.props.leadId) {
            const {companyId, leadId} = this.props;
            this.props.loadLead(companyId, leadId, true);
        }
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
            <div className='LeadNotesPreview'>
                <LeadModal size='small'/>
                <Grid.Column width={6}>
                    <Segment className='lead-profile'>
                        <Link to={`/companies/${lead.company_id}/leads/${lead.id}/notes`}>
                            <Button color="teal">Profile</Button>
                        </Link>
                        <div className="onClosePreview">
                            <Icon name="close" onClick={() => this.props.onClose()} />
                        </div>
                        <div className='lead-profile-row'>
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
                            <div className='lead-profile-label'><label>Integration</label></div>
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
                            <div className='lead-profile-label-additional '><label>Additional information:</label></div>

                        </div>
                        <TimeLine notes={leadNotes} lead={lead} onAddNote={this.onAddNote}
                                  leadStatuses={leadStatuses}/>
                        </div>
                    </Segment>
                </Grid.Column>
            </div>
        )
    }
}

export default compose(BreadCrumbContainer, LeadsContainer, LeadNotesContainer, LeadFormContainer)(LeadNotes);
