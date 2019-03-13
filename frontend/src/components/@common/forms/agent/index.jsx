import React, { Component } from 'react';

import {
  Form,
  Input,
  Segment,
  Image,
  Button,
  Grid,
  label,
  Select,
} from 'semantic-ui-react';
import './index.scss';
import avatarDemo from '../avatar-demo.png';
import * as R from "ramda";
import {Auth} from "@services";

const panes = [
  { menuItem: 'Create Agent', pane: 'Create agent' },
  { menuItem: 'Tab 2', pane: 'Tab 2 Content' },
]
class AgentForm extends Component {
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

  onChangeCompany = (event, data) => {
    this.props.changeForm({ new_companies: data.value });
    this.props.loadSelectBoxCompanies('');
  };

  onSearchChange = event => {
    this.props.loadSelectBoxCompanies(event.target.value);
  };

  componentWillMount() {
    if (Auth.isAgency) {
      this.props.loadSelectBoxCompanies();
    }
  }

  render() {
    const { id, name, phone, email, avatar, avatar_path } = this.props.form;
    return (<Form size='big' className='agentForm'>
      <Grid columns={2} relaxed='very' stackable>
        <Grid.Column>
          <Form.Field required>
            <label>Name</label>
            <Input placeholder='Name' name='name' value={name || ''} onChange={this.onChange} />
          </Form.Field>
          <Form.Field required>
            <label>Phone Number</label>
            <Input placeholder='Phone Number' name='phone' value={phone || ''} onChange={this.onChange} />
          </Form.Field>
          {
            Auth.isAgency ?  <Form.Field
              loading={!this.props.selectBoxCompanies.length}
              control={Select}
              options={this.props.selectBoxCompanies || []}
              label={{ children: 'Company', htmlFor: 'companies-list' }}
              placeholder='Select company'
              search
              multiple
              defaultValue={this.props.form.companies || null}
              onChange={this.onChangeCompany}
              onSearchChange={this.onSearchChange}
              searchInput={{ id: 'companies-list' }}
            />
              : null
          }
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
      <Segment basic>
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
      </Segment>
    </Form>)
  }
}

export default AgentForm;