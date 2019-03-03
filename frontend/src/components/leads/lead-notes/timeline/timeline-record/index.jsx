import React from 'react';
import * as moment from 'moment';
export const TimeLineRecord = ({ note }) => (
  <li className='timeline-record'>
    <div className={`timeline-status timeline-bg-color-${note.status.type[0].toLowerCase()}`}></div>
    <div className='timeline-vertical-line'></div>
    <div className='timeline-record-text'>
      <label className='creation-date'>{moment(note.created_at).format('DD/MM/YYYY')}</label>
      <label className='creation-time'>{moment(note.created_at).format('LT')}</label>
      <div className='timeline-text'>{note.message}</div>
    </div>
  </li>
);
