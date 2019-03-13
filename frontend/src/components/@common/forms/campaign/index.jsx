import React, { Component } from 'react';
import { Form, Input, Select } from 'semantic-ui-react';
import './index.scss';
import {Auth} from "../../../../@services";

class CampaignForm extends Component {
  state = { agentId: '' };

  componentWillMount() {
    const { companyId, dealId, agentId } = this.props;
    this.setState({
      ...this.state,
      agentId: +agentId
    });

    if (companyId && dealId) {
      this.props.changeForm({
        companyId,
        dealId,
      });

      this.props.loadSelectBoxAgents({
        companyId: companyId || this.props.form.companyId,
      });
    }

    if (companyId && agentId) {
      this.props.changeForm({
        companyId,
        dealId,
      });

      this.props.loadSelectBoxAgents({
        companyId: companyId || this.props.form.companyId,
      });

      this.props.getCompanyDeals();
    }

    if (agentId && Auth.isAgency) {
      this.props.loadSelectBoxCompanies('', agentId);
      this.props.getCompanyDeals();

      if (this.props.form.companyId) {
        this.props.filterDealsByCompany(this.props.form.companyId);
        this.props.loadSelectBoxAgents({
          companyId: companyId || this.props.form.companyId,
        });
      }
    }
  }

  onSearchAgent = (event) => {
    const { companyId } = this.props;
    this.props.loadSelectBoxAgents({
      companyId,
      search: event.target.value
    });
  };

  onChange = (event, data) => {
    this.props.changeForm({ [data.name]: data.value });
  };

  onChangeAgents = (event, data) => {
    this.props.changeForm({ agents: data.value });
  };

  onChangeCompany = (event, data) => {
    const companyId = data.value;
    this.props.changeForm({ companyId });
    this.props.filterDealsByCompany(companyId);
    this.props.loadSelectBoxAgents({
      companyId
    });
    this.props.loadSelectBoxCompanies('');
  };

  onChangeCompanyDeal = (event, data) => {
    this.props.changeForm({ dealId: data.value });
  };

  onSearchChange = event => {
    this.props.loadSelectBoxCompanies(event.target.value);
  };

  render() {
    const { agentId } = this.state;
    const { integrationTypes, form } = this.props;
    return (<Form size='big' className='CampaignForm'>
      <Form.Field required>
        <label>Campaign Name</label>
        <Input placeholder='Campaign Name' name='name' value={form.name} onChange={this.onChange} />
      </Form.Field>
      <Form.Field required>
        <label>Integration type</label>
        <Select placeholder='Select Integration'
                name='integration'
                options={integrationTypes}
                defaultValue={form.integration || null}
                onChange={this.onChange} />
      </Form.Field>

      {
        this.state.agentId && Auth.isAgency
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
      {
        this.state.agentId ? <Form.Field
          required
          loading={!this.props.selectBoxDeals.length}
          control={Select}
          options={this.props.selectBoxDeals || []}
          label={{ children: 'Deals', htmlFor: 'deals-list' }}
          placeholder="Select deal"
          search
          defaultValue={this.props.form.deal_id || null}
          onChange={this.onChangeCompanyDeal}
          searchInput={{ id: 'deals-list' }}
        />
          : null
      }

      <Form.Field
        required
        loading={!this.props.selectBoxAgents.length}
        control={Select}
        options={this.props.selectBoxAgents || []}
        label={{ children: 'Assign to', htmlFor: 'agents-list' }}
        placeholder="Select agents"
        search
        multiple
        name='agents'
        onChange={this.onChangeAgents}
        onSearchChange={this.onSearchAgent}
        defaultValue={(form.agents && form.agents.length ? form.agents : agentId) || null}
        searchInput={{ id: 'agents-list' }}
      />
    </Form>)
  }
}

export default CampaignForm;