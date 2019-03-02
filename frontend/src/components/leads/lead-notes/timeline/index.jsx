import React from 'react';
import styles from './index.scss';
import {TimeLineRecord} from "./timeline-record";
import { Button, Icon } from 'semantic-ui-react';

const TimeLine = ({ lead, notes }) => (<div className={styles.TimeLine}>
  <ul>
    <li>
      <div>
        <label>{lead.agent.name}</label>
        <small>Current Status: <span className='status'>{lead.status}</span></small>
      </div>
    </li>
    {
      notes && notes.map(note => <TimeLineRecord {...note}  />)
    }
  </ul>
  <Button>
    <Icon name='plus' />
    Add note
  </Button>
</div>);

export default TimeLine;