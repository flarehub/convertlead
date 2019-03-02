import React, { Component }  from 'react';

import {
  Form,
  Input,
  Segment,
} from 'semantic-ui-react';

const OptinForm = ({ integrationForm, form, ...props }) => (
  <Form>
    <h1>{ integrationForm.header.title }</h1>
    {
      integrationForm.fullname.isVisible
        ?
        <Form.Field required={integrationForm.fullname.isRequired}>
          <label>{ integrationForm.fullname.label }</label>
          <Input name='fullname'
                 value={form.fullname}
                 placeholder={ integrationForm.fullname.placeholder }
                 onChange={props.onChange}
          />
        </Form.Field>
        : null
    }
    {
      integrationForm.phone.isVisible
        ? <Form.Field required={integrationForm.phone.isRequired}>
          <label>{ integrationForm.phone.label }</label>
          <Input
            name='phone'
            value={form.phone}
            placeholder={ integrationForm.phone.placeholder }
            onChange={props.onChange}
          />
        </Form.Field>
        : null
    }
    {
      integrationForm.email.isVisible
        ?  <Form.Field required={integrationForm.email.isRequired}>
          <label>{ integrationForm.email.label }</label>
          <Input name='email'
                 value={form.email}
                 placeholder={ integrationForm.email.placeholder }
                 onChange={props.onChange}
          />
        </Form.Field>
        : null
    }
    <Segment basic textAlign='right'>
      <Form.Button onClick={props.onSubmit}>{ integrationForm.button.name }</Form.Button>
    </Segment>
  </Form>
);

export default OptinForm;