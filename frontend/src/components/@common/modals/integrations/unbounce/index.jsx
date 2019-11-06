import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import './index.scss';
import WebHook from "components/@common/forms/integrations/webhook";

class UnbounceIntegrationModal extends Component {
  state = {
    open: false,
  };

  render() {
    const { campaignLink }  = this.props;
    return (
      <Modal className='ApiIntegration' open={this.props.open} onClose={this.props.onClose}>
        <Modal.Header>Unbounce API Integration</Modal.Header>
        <Modal.Content>
          <WebHook campaignLink={campaignLink}/>
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

export default UnbounceIntegrationModal