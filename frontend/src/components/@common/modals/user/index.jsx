import React  from 'react';
import EntityModal from "../index";
import { compose } from 'recompose';
import { UserFormContainer, MessageContainer } from "@containers";
import UserForm from "../../forms/user";

const UserModal = (props) => (<EntityModal {...{...props, Container: UserForm }} />);

export default compose(UserFormContainer, MessageContainer)(UserModal);