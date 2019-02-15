import React, { Component } from 'react';
import EntityModal from "../index";
import { compose } from 'recompose';
import { CompanyFormContainer, MessageContainer } from "../../../../@containers";
import CompanyForm from "../../forms/company";

const CompanyModal = (props) => (<EntityModal {...{...props, Container: CompanyForm }} />);

export default compose(CompanyFormContainer, MessageContainer)(CompanyModal);