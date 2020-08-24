import React from 'react';
import { compose } from 'recompose';
import EntityModal from "../index";
import { AutomationFormContainer } from "@containers";
import AutomationForm from "components/@common/forms/automation";

const AutomationModal = (props) => (<EntityModal {...{...props, Container: AutomationForm }} />);

export default compose(AutomationFormContainer)(AutomationModal);
