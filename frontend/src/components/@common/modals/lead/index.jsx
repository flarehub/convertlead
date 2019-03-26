import React, { Component } from 'react';
import EntityModal from "../index";
import { compose } from 'recompose';
import {
  CompaniesContainer, DealsContainer, MessageContainer, LeadFormContainer,
  LeadsContainer, ProfileContainer
} from "@containers";
import LeadForm from "../../forms/lead";

const LeadModal = (props) => (<EntityModal {...{...props, Container: LeadForm }} />);

export default compose(ProfileContainer, LeadFormContainer, MessageContainer, LeadsContainer, CompaniesContainer, DealsContainer)(LeadModal);