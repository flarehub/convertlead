import React, { Component } from 'react';
import EntityModal from "../index";
import { compose } from 'recompose';
import {DealFormContainer} from "../../../../@containers";
import DealForm from "../../forms/deal";

const DealModal = (props) => (<EntityModal {...{...props, Container: DealForm }} />);

export default compose(DealFormContainer)(DealModal);