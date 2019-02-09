import React, { Component } from 'react';
import {
  Modal,
  Image,
  Header,
  Segment,
  Button,
  Form,
  Input,
  label,
  Icon,
} from 'semantic-ui-react';
import styles from './index.scss';
import avatarDemo from './avatar-demo.png';

class EntityModal extends Component {
  close = () => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose()
    }
  }

  save = () => {
    if (this.props.onSave === 'function') {
      this.props.onSave()
    }
  }

  componentDidMount() {
    this.setState({ open: this.props.open })
  }

  render() {
    const entity  = this.props.entity || {
      name: 'Test',
      email: '',
      password: '',
      password_confirmation: '',
      avatar: '',
    };

    const { open, title } = this.props;
    return (<Modal className={styles.EntityModal} centered={false}
                   size='tiny' dimmer='blurring' open={open} onClose={this.close}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Form size='big'>
          <Form.Field required>
            <label>Company Name</label>
            <Input placeholder='Company Name' />
          </Form.Field>
          <Form.Field required>
            <label>Phone Number</label>
            <Input placeholder='Phone Number' />
          </Form.Field>
          <Form.Field required>
            <label>Email Address</label>
            <Input placeholder='Email Address' />
          </Form.Field>
          <Form.Field required>
            <label>Password</label>
            <Input placeholder='Password' />
          </Form.Field>
          <Form.Field required>
            <label>Re-enter Password</label>
            <Input placeholder='Password' />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Segment floated='left'>
          <Image size='tiny' circular src={avatarDemo} />
          <Button>Change</Button>
        </Segment>
        <Button
          positive
          icon='checkmark'
          labelPosition='right'
          content="Save"
          onClick={this.save}
        />
      </Modal.Actions>
    </Modal>)
  }
}

export default EntityModal;