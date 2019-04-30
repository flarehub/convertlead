import React, {Component} from 'react';
import * as moment from 'moment';
import './index.scss';

export class LeadNoteTimeLine extends Component {
    componentWillMount() {
    }

    render() {
        const {notes} = this.props;
        console.log(notes);
        return (
            <div>
                {
                    notes && notes.map(note =>
                        <div className='lead-note' key={note.id}>
                            <div className='lead-note-datetime'>
                                <span className='lead-note-date'>{moment(note.created_at).format('DD.MM.YYYY')}</span>
                                <span className='lead-note-time'>{moment(note.created_at).format('LT')}</span>
                            </div>
                            <div className='lead-note-content'>
                                <span className='agent-name'>{note.agent.name}, </span> {note.message}
                            </div>
                        </div>
                    )
                }
            </div>);
    }
}