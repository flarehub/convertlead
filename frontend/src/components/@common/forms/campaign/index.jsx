import React, { Component } from 'react';
import { Form, Input, Select } from 'semantic-ui-react';
import styles from './index.scss';

class CampaignForm extends Component {
  componentWillMount() {
    const { companyId, dealId } = this.props;
    this.props.loadSelectBoxAgents({
      companyId
    });
    this.props.changeForm({
      companyId,
      dealId,
    });
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

  render() {
    const { integrationTypes, form } = this.props;
    return (<Form size='big' className={styles.CampaignForm}>
      <Form.Field required>
        <label>Campaign Name</label>
        <Input placeholder='Campaign Name' name='name' value={form.name} onChange={this.onChange} />
      </Form.Field>
      <Form.Field required>
        <label>Integration type</label>
        <Select placeholder='Select Integration'
                name='integration'
                options={integrationTypes}
                defaultValue={form.integration}
                onChange={this.onChange} />
      </Form.Field>
      <Form.Field>
        <Form.Field
          required
          loading={!this.props.selectBoxAgents}
          control={Select}
          options={this.props.selectBoxAgents || []}
          label={{ children: 'Assign to', htmlFor: 'agents-list' }}
          placeholder="Select agents"
          search
          multiple
          name='agents'
          onChange={this.onChangeAgents}
          onSearchChange={this.onSearchAgent}
          defaultValue={form.agents}
          searchInput={{ id: 'agents-list' }}
        />
      </Form.Field>
    </Form>)
  }
}

export default CampaignForm;