import React  from 'react';
import EntityModal from "../index";
import { compose } from 'recompose';
import {CompaniesContainer, DealsContainer, MessageContainer, LeadFormContainer} from "../../../../@containers";
import LeadForm from "../../forms/lead";

const LeadModal = (props) => (<EntityModal {...{...props, Container: LeadForm }} />);

export default compose(LeadFormContainer, MessageContainer, DealsContainer, CompaniesContainer)(LeadModal);