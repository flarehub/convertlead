import React, { Component } from 'react';
import {
  Form,
  Input,
  TextArea,
  Select,
  Grid,
} from 'semantic-ui-react';
import './index.scss';
import * as R from "ramda";

class LeadForm extends Component {

  onChange = (event, data) => {
    this.props.changeForm({ [data.name]: data.value });
  };

  onChangeCompany = (event, data) => {
    this.props.changeForm({ companyId: data.value });
    this.props.filterDealsByCompany(data.value);
    this.props.filterDealsByDealId('');
  };

  onChangeDeal = (event, data) => {
    this.props.filterDealsByDealId(data.value);
    this.props.filterDealCampaignsById('');
  };

  onChangeCampaign = (event, data) => {
    this.props.changeForm({ deal_campaign_id: data.value });
    this.props.filterDealCampaignsById(data.value);
  };

  onChangeAgent = (event, data) => {
    this.props.changeForm({ agentId: data.value });
  };

  componentWillMount() {
    const companyId = this.props.form.companyId || (this.props.selectBoxCompanies[0] && this.props.selectBoxCompanies[0].value);
    this.props.filterDealsByCompany(companyId);
  }

  render() {
    const { fullname, email, phone, metadata, id } = this.props;
    return (<Form size='big'>
      <Grid columns={2} relaxed='very' stackable>
        <Grid.Column>
          <Form.Field required>
            <label>Full name</label>
            <Input placeholder='Full Name' value={fullname} name='fullname' onChange={this.onChange}  />
          </Form.Field>
          <Form.Field required>
            <label>Email Address</label>
            <Input placeholder='Email Address' value={email} name='email' onChange={this.onChange}  />
          </Form.Field>
          <Form.Field required>
            <label>Phone Number</label>
            <Input placeholder='Phone Number' value={phone} name='phone' onChange={this.onChange}  />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <TextArea placeholder='Description' value={metadata} name='metadata' onChange={this.onChange}  />
          </Form.Field>
        </Grid.Column>
        <Grid.Column>
            <Form.Field
              required
              loading={!this.props.selectBoxCompanies.length}
              control={Select}
              options={this.props.selectBoxCompanies || []}
              label={{ children: 'Company', htmlFor: 'companies-list' }}
              placeholder='Select company'
              search
              defaultValue={this.props.form.companyId || (this.props.selectBoxCompanies[0] && this.props.selectBoxCompanies[0].value) }
              onChange={this.onChangeCompany}
              searchInput={{ id: 'companies-list' }}
            />
            <Form.Field
              required
              loading={!this.props.selectBoxDeals.length}
              control={Select}
              options={this.props.selectBoxDeals || []}
              label={{ children: 'Deals', htmlFor: 'deals-list' }}
              placeholder='Select deal'
              search
              defaultValue={this.props.form.dealId}
              onChange={this.onChangeDeal}
              searchInput={{ id: 'deals-list' }}
            />
            <Form.Field
              required
              loading={!this.props.selectBoxDealCampaigns.length}
              control={Select}
              options={this.props.selectBoxDealCampaigns || []}
              label={{ children: 'Campaigns', htmlFor: 'campaigns-list' }}
              placeholder='Select campaign'
              search
              defaultValue={this.props.form.campaignId}
              onChange={this.onChangeCampaign}
              searchInput={{ id: 'campaigns-list' }}
            />
            <Form.Field
              required
              loading={!this.props.selectBoxDealCampaignAgents}
              control={Select}
              options={this.props.selectBoxDealCampaignAgents || []}
              label={{ children: 'Agents', htmlFor: 'agents-list' }}
              placeholder='Select agent'
              search
              defaultValue={this.props.form.agentId}
              onChange={this.onChangeAgent}
              searchInput={{ id: 'agents-list' }}
            />
          </Grid.Column>
      </Grid>
    </Form>)
  }
}

export default LeadForm;