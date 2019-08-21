import React from 'react';
import * as moment from 'moment';
export const TimeLineRecord = ({ note }) => (
  <li className='timeline-record'>
    <div className={`timeline-status timeline-bg-color-${note.status.type[0].toLowerCase()}`}/>
    <div className='timeline-vertical-line'/>
    <div className='timeline-record-text'>
      <label className='creation-date'>{moment.utc(note.created_at).local().format('DD/MM/YYYY')}</label>
      <label className='creation-time'>{moment.utc(note.created_at).local().format('LT')}</label>
      <div className='timeline-text'>{note.agent.name}, {note.message}</div>
    </div>
  </li>
);
