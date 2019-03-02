import React, { Component } from 'react';

import {
  Form,
  Button,
  Input, Checkbox
} from 'semantic-ui-react';
import CopyText from 'react-copy-text';

class OptInForm extends Component {
  state = {
    value: '',
    copied: false,
  }
  onChange = (field, event, data) => {
    this.props.changeOptinForm(field, {
      [data.name]: (data.hasOwnProperty('checked') ? data.checked : data.value),
    });
  };

  onCopy = () => {
    this.setState({copied: true, value: this.props.optinFormLink});
    setTimeout(() => {
      this.setState({
        copied: false,
        value: '',
      })
    }, 400)
  }

  render() {
    const { integrationForm } = this.props.form;
    return (
      <div>
        <Form size='big'>
          <Form.Field>
            <label>Form Title</label>
            <Input placeholder='Form Title'
                   name='title'
                   value={integrationForm.header.title}
                   onChange={this.onChange.bind(this, 'header')} />
          </Form.Field>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Name Label</label>
              <Input placeholder='Fullname label'
                     value={integrationForm.fullname.label}
                     name='label'
                     onChange={this.onChange.bind(this, 'fullname')} />
            </Form.Field>
            <Form.Field>
              <label>Palceholder</label>
              <Input placeholder='Fullname Placeholder'
                     name='placeholder'
                     value={integrationForm.fullname.placeholder}
                     onChange={this.onChange.bind(this, 'fullname')} />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field control={Checkbox}
                        name='isRequired'
                        checked={integrationForm.fullname.isRequired}
                        onChange={this.onChange.bind(this, 'fullname')}
                        label={<label>Name Is required</label>}
            />
            <Form.Field control={Checkbox}
                        name='isVisible'
                        checked={integrationForm.fullname.isVisible}
                        onChange={this.onChange.bind(this, 'fullname')}
                        label={<label>Name Is visible</label>}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Phone Label</label>
              <Input placeholder='Phone Label'
               name='label'
               value={integrationForm.phone.label}
               onChange={this.onChange.bind(this, 'phone')}
              />
            </Form.Field>
            <Form.Field>
              <label>Placeholder</label>
              <Input placeholder='Phone Placeholder'
                 name='placeholder'
                 value={integrationForm.phone.placeholder}
                 onChange={this.onChange.bind(this, 'phone')}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field control={Checkbox}
                        name='isRequired'
                        checked={integrationForm.phone.isRequired}
                        onChange={this.onChange.bind(this, 'phone')}
                        label={<label>Phone Is required</label>}
            />
            <Form.Field control={Checkbox}
                        name='isVisible'
                        checked={integrationForm.phone.isVisible}
                        onChange={this.onChange.bind(this, 'phone')}
                        label={<label>Phone Is visible</label>}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>E-mail Label</label>
              <Input placeholder='Email Label'
                     name='label'
                     value={integrationForm.email.label}
                     onChange={this.onChange.bind(this, 'email')}
              />
            </Form.Field>
            <Form.Field>
              <label>E-mail Placeholder</label>
              <Input placeholder='Email Placeholder'
                     name='placeholder'
                     value={integrationForm.email.placeholder}
                     onChange={this.onChange.bind(this, 'email')}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field control={Checkbox}
                        name='isRequired'
                        checked={integrationForm.email.isRequired}
                        onChange={this.onChange.bind(this, 'phone')}
                        label={<label>Email Is required</label>}
            />
            <Form.Field control={Checkbox}
                        name='isVisible'
                        checked={integrationForm.email.isVisible}
                        onChange={this.onChange.bind(this, 'phone')}
                        label={<label>Email Is visible</label>}
            />
          </Form.Group>
          <Form.Field>
            <label>Button Subscribe</label>
            <Input placeholder='Button Subscribe'
                   name='label'
                   value={integrationForm.button.name}
                   onChange={this.onChange.bind(this, 'button')}
            />
          </Form.Field>
          <Form.Field>
            <label>Form Link</label>
            <CopyText text={this.state.value} onCopied={this.onCopied}  />
            <Input
              action={{
                color: 'teal',
                labelPosition: 'right',
                icon: 'copy',
                content: `${(this.state.copied ? 'Copied' : 'Copy')}`, onClick: this.onCopy }}
              defaultValue={this.props.optinFormLink}
            />
          </Form.Field>
        </Form>
      </div>
    );
  }
}

export default OptInForm;