import React, { Component } from 'react';

import {
  Form,
  Input,
  label,
  Select,
} from 'semantic-ui-react';
import './index.scss';
import {Auth} from "@services";

class DealForm extends Component {
  state = {};
  onChangeName = (event, data) => {
    this.props.changeForm({ name: data.value });
  };

  onChangeCompany = (event, data) => {
    this.props.changeForm({ companyId: data.value });
  };

  onChangeAgency = (event, data) => {
    this.props.changeForm({ agency_company_id: data.value });
  };

  onSearchChange = event => {
    this.props.searchCompanies(event.target.value);
  };

  render() {
    const { name } = this.props.form;
    return (<Form size='big'>
      <Form.Field required>
        <label>Name</label>
        <Input placeholder='Deal name' value={name} onChange={this.onChangeName} />
      </Form.Field>
      {
        Auth.isAgency ?
          <Form.Field
            loading={!this.props.selectBoxCompanies.length}
            control={Select}
            options={this.props.selectBoxCompanies || []}
            label={{ children: 'Company', htmlFor: 'deal-form-companies-list' }}
            placeholder='Select company'
            search
            defaultValue={this.props.form.companyId}
            onChange={this.onChangeCompany}
            onSearchChange={this.onSearchChange}
            searchInput={{ id: 'deal-form-companies-list' }}
          />
          : null
      }
      {
        Auth.isCompany ?
          <Form.Field
            loading={!this.props.selectBoxAgencies}
            control={Select}
            options={this.props.selectBoxAgencies || []}
            label={{ children: 'Agency', htmlFor: 'deal-form-agencies-list' }}
            placeholder='Select Agency'
            search
            defaultValue={this.props.form.agency_company_id}
            onChange={this.onChangeAgency}
            searchInput={{ id: 'deal-form-agencies-list' }}
          />
          : null
      }
    </Form>)
  }
}

export default DealForm;