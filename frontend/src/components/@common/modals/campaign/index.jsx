import React, { Component } from 'react';
import { compose } from 'recompose';
import EntityModal from "../index";
import { AgentsContainer, CampaignFormContainer, MessagesContainer } from "@containers";
import CampaignForm from "../../forms/campaign";

class CampaignModal extends Component {
  render() {
    return (<EntityModal {...{...this.props, Container: CampaignForm }} />)
  }
}

export default compose(
  CampaignFormContainer,
  MessagesContainer,
  AgentsContainer)(CampaignModal);