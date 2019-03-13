import React, { Component } from 'react';
import * as R from 'ramda';
import {
  Modal,
  Button,
} from 'semantic-ui-react';
import './index.scss';

class EntityModal extends Component {
  onSave = () => {
    if (this.validate()) {
      this.props.saveForm(this.props.form);
    }
  };

  validate = () => {
    if (R.has('required', this.props)) {
      const requiredFields = R.mapObjIndexed((value, fieldName) => {
        if (!this.props.form[fieldName] && value) {
          return {
            field: fieldName,
            required: true,
          }
        }
        return {
          required: false
        }
      }, this.props.required) || [];

      const fields = R.reduce((acc, value) => {
        return `${(acc ? acc+',\n'+value.field : value.field)}`
      }, '', R.filter(field => field.required, R.values(requiredFields)));
      if (fields) {
        this.props.sendMessage(`Missing required "${fields}"!`, true);
        return false;
      }
    }
    return true;
  };

  render() {
    const { Container, ...rest } = this.props;

    return (<Modal className='freshAppEntityModal' open={this.props.form.show} centered={false}
                   size={rest.size || 'tiny'} dimmer='blurring' onClose={this.props.loadForm.bind(this, { show: false })}>
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