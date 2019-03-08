import React, { Component } from 'react';
import styles from './index.scss';
import {TimeLineRecord} from "./timeline-record";
import { Button, Form, Icon, TextArea, Dropdown, Popup } from 'semantic-ui-react';

class TimeLine extends Component {
  state = {
    form: {
      message: '',
      status: '',
    },
    showAddNote: false
  };

  showAddNote = () => {
    this.setState({
      showAddNote: true
    });
  };

  onCancelAddNote = () => {
    this.setState({
      showAddNote: false
    });
  };

  onAddNote = () => {
    this.props.onAddNote(this.state.form)
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

  render() {
    const { lead, notes, leadStatuses } = this.props;
    return (<div className={styles.TimeLine}>
      <ul>
        <li className='timeline-record'>
          <div className={`timeline-status timeline-bg-color-${lead.status.charAt(0).toLowerCase()}`}>
            <span>{lead.fullname && lead.fullname.charAt(0) || lead.status.charAt(0)}</span>
          </div>
          <div className='timeline-vertical-line'></div>
          <div className='timeline-record-text'>
            <label>{lead.fullname}</label>
            <div className='timeline-current-status'>Current Status: <span className={`status timeline-color-${lead.status.charAt(0).toLowerCase()}`}>{lead.status}</span></div>
          </div>
        </li>
        {
          notes && notes.map((note, key) => <TimeLineRecord key={key} note={note}  />)
        }
      </ul>
      {
        this.state.showAddNote
        ? <Form>
            <Form.Field>
              <TextArea name='message' onChange={this.onChange} />
            </Form.Field>
            <Button.Group>
              <Button onClick={this.onCancelAddNote}>Cancel</Button>
              <Button.Or />
              <Button onClick={this.onAddNote} positive>Submit</Button>
              <Dropdown options={leadStatuses} name='status' onChange={this.onChange} floating button className='icon' defaultValue={lead.status} />
            </Button.Group>
          </Form>
          : <Button onClick={this.showAddNote}>
            <Icon name='plus' />
            Add note
          </Button>
      }
    </div>)
  }
}

export default TimeLine;