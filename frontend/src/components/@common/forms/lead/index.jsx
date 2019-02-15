import React, { Component } from 'react';
import { FormContainer } from '@containers';
import 'index.scss';

class LeadForm extends Component {
  render() {
    return (<Form size='big'>
      <Form.Field required>
        <label>Company Name</label>
        <Input placeholder='Company Name' />
      </Form.Field>
      <Form.Field required>
        <label>Phone Number</label>
        <Input placeholder='Phone Number' />
      </Form.Field>
      <Form.Field required>
        <label>Email Address</label>
        <Input placeholder='Email Address' />
      </Form.Field>
      <Form.Field required>
        <label>Password</label>
        <Input placeholder='Password' />
      </Form.Field>
      <Form.Field required>
        <label>Re-enter Password</label>
        <Input placeholder='Password' />
      </Form.Field>
    </Form>)
  }
}

export default FormContainer(LeadForm);