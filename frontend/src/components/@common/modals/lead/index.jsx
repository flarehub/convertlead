import React, { Component } from 'react';
import EntityModal from "../index";
import { compose } from 'recompose';
import {
  CompaniesContainer, DealsContainer, MessageContainer, LeadFormContainer,
  LeadsContainer
} from "../../../../@containers";
import LeadForm from "../../forms/lead";

class LeadModal extends Component {
  componentWillMount() {
    this.props.loadSelectBoxCompanies();
    this.props.getCompanyDeals();
  }
  render() {
    return (<EntityModal {...{...this.props, Container: LeadForm }} />)
  }
}

export default compose(LeadFormContainer, MessageContainer, LeadsContainer, DealsContainer, CompaniesContainer)(LeadModal);