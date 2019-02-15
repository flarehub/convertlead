import React, { Component } from 'react';
import EntityModal from "../index";
import {FormContainer} from "@containers";

class AgentModal extends Component {
  render() {
    return (<EntityModal {...{...this.props,Container: AgentForm}} />)
  }
}

export default FormContainer(AgentModal);