import React, { Component } from 'react';
import * as R from 'ramda';
import {
  Form,
  Input,
  Segment,
  Image,
  Button,
  Grid,
} from 'semantic-ui-react';
import './index.scss';
import avatarDemo from '../avatar-demo.png';

class CompanyForm extends Component {
  onFileLoad = (event) => {
    if (!R.pathOr(false, ['target', 'files'], event)) {
      this.props.sendMessage('Missing required File!', true);
      return false;
    }

    const file = event.target.files[0];
    const reader  = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
      this.props.changeForm({
        avatar: reader.result,
      });
    }, false);
  };

  onChange = (event, data) => {
    this.props.changeForm({ [data.name]: data.value });
  };

  render() {
    const { id, name, phone, email, avatar, avatar_path } = this.props.form;
    return (<Form size='big'>
      <Grid columns={2} relaxed='very' stackable>
        <Grid.Column>
          <Form.Field required>
            <label>Company Name</label>
            <Input placeholder='Company Name' name='name' value={name || ''} onChange={this.onChange} />
          </Form.Field>
          <Form.Field required>
            <label>Phone Number</label>
            <Input placeholder='Phone Number' name='phone' value={phone || ''} onChange={this.onChange} />
          </Form.Field>
          <Segment.Inline>
            <Image size='tiny' circular src={avatar || avatar_path || avatarDemo} />
            <label
              htmlFor="avatar"
            >
              <Button
                icon="upload"
                label={{
                  basic: true,
                  content: 'Select file'
                }}
                labelPosition="right"
              />
              <input
                hidden
                accept=".png, .jpeg, .jpg, image/png, image/jpeg, image/jpg"
                id="avatar"
                type="file"
                onChange={this.onFileLoad}
              />
            </label>
          </Segment.Inline>
        </Grid.Column>
        <Grid.Column verticalAlign='middle'>
          <Form.Field required>
            <label>Email Address</label>
            <Input placeholder='Email Address' name='email' value={email || ''} onChange={this.onChange} />
          </Form.Field>
          <Form.Field required={(id ? false : true )}>
            <label>Password</label>
            <Input placeholder='Password' name='password' type='password' onChange={this.onChange} />
          </Form.Field>
          <Form.Field required={(id ? false : true )}>
            <label>Re-enter Password</label>
            <Input placeholder='Password' name='password_confirmation' type='password' onChange={this.onChange} />
          </Form.Field>

        </Grid.Column>
      </Grid>
    </Form>)
  }
}

export default CompanyForm;