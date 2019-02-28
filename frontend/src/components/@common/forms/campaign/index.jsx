import React, { Component } from 'react';
import { Form, Input, Select } from 'semantic-ui-react';
import styles from './index.scss';

class CampaignForm extends Component {
  render() {
    const { integrationTypes, form } = this.props;
    return (<Form size='big' className={styles.CampaignForm}>
      <Form.Field required>
        <label>Campaign Name</label>
        <Input placeholder='Campaign Name' />
      </Form.Field>
      <Form.Field required>
        <label>Integration type</label>
        <Select placeholder='Select Integration' options={integrationTypes} />
      </Form.Field>
      <Form.Field>
        <Form.Field
          required
          loading={!integrationTypes}
          control={Select}
          options={integrationTypes || []}
          label={{ children: 'Assign to', htmlFor: 'agents-list' }}
          placeholder="Select agent"
          search
          defaultValue={this.props.form.agent_id}
          searchInput={{ id: 'agents-list' }}
        />
      </Form.Field>
    </Form>)
  }
}

export default CampaignForm;