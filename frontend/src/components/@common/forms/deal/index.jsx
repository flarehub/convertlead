import React, { Component } from 'react';
import {CompaniesContainer} from "../../../../@containers";

import {
  Form,
  Input,
  Segment,
  Image,
  Button,
  label,
  Select,
} from 'semantic-ui-react';
import './index.scss';

class DealForm extends Component {

  onChangeName = (event, data) => {
    this.props.changeForm({ name: data.value });
  };

  onChangeCompany = (event, data) => {
    this.props.changeForm({ companyId: data.value });
  };

  render() {
    const { name } = this.props.form;
    return (<Form size='big'>
      <Form.Field required>
        <label>Name</label>
        <Input placeholder='Deal name' value={name} onChange={this.onChangeName} />
      </Form.Field>
      <Form.Field
        loading={!this.props.selectBoxCompanies.length}
        control={Select}
        options={this.props.selectBoxCompanies || []}
        label={{ children: 'Company', htmlFor: 'deal-form-companies-list' }}
        placeholder='Select company'
        search
        defaultValue={this.props.form.companyId}
        onChange={this.onChangeCompany}
        searchInput={{ id: 'deal-form-companies-list' }}
      />
    </Form>)
  }
}

export default CompaniesContainer(DealForm);