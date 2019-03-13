import React, { Component } from 'react';
import {
  Form,
  Input,
  TextArea,
  Select,
  Grid,
} from 'semantic-ui-react';
import './index.scss';
import {Auth} from "../../../../@services";

class LeadForm extends Component {
  componentWillMount() {
    if (this.props.form.id) {
      this.props.filterDealsByDealId(this.props.form.deal_id);
      this.props.filterDealsByCompany(this.props.form.company_id);
      this.props.filterDealCampaignsById(this.props.form.deal_campaign_id);
    }
    if (Auth.isAgency) {
      this.props.loadSelectBoxCompanies();
    }
    if (Auth.isCompany) {
      this.props.changeForm({ company_id: this.props.profile.id });
    }
    this.props.getCompanyDeals();
  }

  onChange = (event, data) => {
    this.props.changeForm({ [data.name]: data.value });
  };

  onChangeCompany = (event, data) => {
    this.props.changeForm({ company_id: data.value });
    this.props.filterDealsByCompany(data.value);
    this.props.filterDealsByDealId('');
    this.props.loadSelectBoxCompanies('');
  };

  onChangeStatus = (event, data) => {
    this.props.changeForm({ status: data.value });
  };

  onSearchChange = event => {
    this.props.searchCompanies(event.target.value);
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
    this.props.changeForm({ agent_id: data.value });
  };

  render() {
    const {
      fullname, email, phone, metadata,
    } = this.props.form;
    return (
      <Form size="big" className='leadForm'>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            <Form.Field required>
              <label>Full name</label>
              <Input placeholder="Full Name" value={fullname || ''} name="fullname" onChange={this.onChange} />
            </Form.Field>
            <Form.Field required>
              <label>Email Address</label>
              <Input placeholder="Email Address" value={email || ''} name="email" onChange={this.onChange} />
            </Form.Field>
            <Form.Field required>
              <label>Phone Number</label>
              <Input placeholder="Phone Number" value={phone || ''} name="phone" onChange={this.onChange} />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <TextArea placeholder="Description" value={metadata || ''} name="metadata" onChange={this.onChange} />
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Form.Field
              required
              loading={!this.props.selectBoxStatuses.length}
              control={Select}
              options={this.props.selectBoxStatuses || []}
              label={{ children: 'Statuses', htmlFor: 'status-list' }}
              placeholder="Select status"
              search
              defaultValue={this.props.form.status || null}
              onChange={this.onChangeStatus}
              searchInput={{ id: 'status-list' }}
            />
            {
              Auth.isAgency
                ? <Form.Field
                  required
                  loading={!this.props.selectBoxCompanies.length}
                  control={Select}
                  options={this.props.selectBoxCompanies || []}
                  label={{ children: 'Company', htmlFor: 'companies-list' }}
                  placeholder="Select company"
                  search
                  defaultValue={this.props.form.company_id || null}
                  onChange={this.onChangeCompany}
                  onSearchChange={this.onSearchChange}
                  searchInput={{ id: 'companies-list' }}
                />
                : null
            }
            <Form.Field
              required
              loading={!this.props.selectBoxDeals.length}
              control={Select}
              options={this.props.selectBoxDeals || []}
              label={{ children: 'Deals', htmlFor: 'deals-list' }}
              placeholder="Select deal"
              search
              defaultValue={this.props.form.deal_id || null}
              onChange={this.onChangeDeal}
              searchInput={{ id: 'deals-list' }}
            />
            <Form.Field
              required
              loading={!this.props.selectBoxDealCampaigns.length}
              control={Select}
              options={this.props.selectBoxDealCampaigns || []}
              label={{ children: 'Campaigns', htmlFor: 'campaigns-list' }}
              placeholder="Select campaign"
              search
              defaultValue={this.props.form.deal_campaign_id || null}
              onChange={this.onChangeCampaign}
              searchInput={{ id: 'campaigns-list' }}
            />
            <Form.Field
              required
              loading={!this.props.selectBoxDealCampaignAgents}
              control={Select}
              options={this.props.selectBoxDealCampaignAgents || []}
              label={{ children: 'Agents', htmlFor: 'agents-list' }}
              placeholder="Select agent"
              search
              defaultValue={this.props.form.agent_id || null}
              onChange={this.onChangeAgent}
              searchInput={{ id: 'agents-list' }}
            />
          </Grid.Column>
        </Grid>
      </Form>
    );
  }
}

export default LeadForm;
