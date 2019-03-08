import React from 'react';
import { compose, lifecycle } from 'recompose';
import EntityModal from "../index";
import { MessagesContainer, AgentFormContainer, CompaniesContainer } from "@containers";
import AgentForm from "components/@common/forms/agent";

const AgentModal = (props) => (<EntityModal {...{...props, Container: AgentForm}} />);

export default compose(MessagesContainer, AgentFormContainer, CompaniesContainer)(AgentModal);
