import React, { Component } from 'react'
import { Button, Form, Input, Header, Image, Modal } from 'semantic-ui-react'
import styles from './index.scss';
import CopyText from 'react-copy-text';
import ReactJson from 'react-json-view'
import ResponseLeadSchema from './schemas/response-lead';
import RequestLeadSchema from './schemas/reques-lead';

class ZapierInterationModal extends Component {
  state = {
    open: false,
    copied: false
  };

  onCopy = () => {
    this.setState({copied: true, value: this.props.campaignLink});
    setTimeout(() => {
      this.setState({
        copied: false,
        value: '',
      })
    }, 400)
  };

  render() {
    return (
      <Modal className={styles.ApiIntegration} open={this.props.open} onClose={this.props.onClose}>
        <Modal.Header>Zapier API Integration</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <h2>Campaign Link</h2>
              <CopyText text={this.state.value}  />
              <Input
                action={{
                  color: 'teal',
                  labelPosition: 'right',
                  icon: 'copy',
                  content: `${(this.state.copied ? 'Copied' : 'Copy')}`, onClick: this.onCopy }}
                defaultValue={this.props.campaignLink}
              />
            </Form.Field>
            <Form.Field>
              <h2>Request Body</h2>
              <ReactJson name="Body" collapsed={true} src={RequestLeadSchema}/>
            </Form.Field>
            <Form.Field>
              <h2>Request response</h2>
              <ReactJson collapsed={true} name='Lead' src={ResponseLeadSchema} />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={this.props.onClose}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ZapierInterationModal