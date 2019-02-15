import React, { Component } from 'react';
import {
  Modal,
  Button,
  label,
} from 'semantic-ui-react';
import { FormContainer } from '@containers';
import styles from './index.scss';

class EntityModal extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log();
  }

  onSave = () => {
    this.props.saveForm(this.props.form);
  }

  render() {
    const { Container, ...rest } = this.props;

    return (<Modal className={styles.EntityModal} open={this.props.form.show} centered={false}
                   size='tiny' dimmer='blurring' onClose={this.props.loadForm.bind(this, { show: false })}>
      <Modal.Header>{this.props.form.title}</Modal.Header>
      <Modal.Content>
      <Container {...rest} />
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={this.props.loadForm.bind(this, { show: false })}>
          Close
        </Button>
        <Button
          positive
          icon='checkmark'
          labelPosition='right'
          content="Save"
          onClick={this.onSave}
        />
      </Modal.Actions>
    </Modal>)
  }
}

export default EntityModal;