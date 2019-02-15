import React, { Component } from 'react';
import EntityModal from "../index";
import { CampaignContainer } from "@containers";
import { CampaignForm } from "../../forms/campaign";

class CampaignModal extends Component {
  render() {
    return (<EntityModal {...{...this.props, Container: CampaignForm }} />)
  }
}

export default CampaignContainer(CampaignModal);