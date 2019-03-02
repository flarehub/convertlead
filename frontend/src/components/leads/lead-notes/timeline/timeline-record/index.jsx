import React from 'react';
import * as moment from 'moment';
export const TimeLineRecord = ({ note }) => (
  <li className='timeline-record'>
    <div className='timeline-status'>{note.status.type[0]}</div>
    <div className='timeline-vertical-line'></div>
    <div className='timeline-record-text'>
      <label className='creation-date'>{moment(note.created_at).format('DD/MM/YYYY')}</label>
      <label className='creation-time'>{moment(note.created_at).format('LTS')}</label>
      <div>{note.message}</div>
    </div>
  </li>
);
