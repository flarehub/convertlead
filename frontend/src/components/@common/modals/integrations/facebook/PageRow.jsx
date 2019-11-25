import { compose } from 'recompose';
import React, { Component } from 'react'
import { Button, Table, Select } from 'semantic-ui-react'
import {MessagesContainer} from "@containers";

import './index.scss';
class PageRow extends Component {
  state = {
    pageForms: [],
    pageForm: null,
    defaultForm: null
  };

  createNewPageForm = () => {
    if (!this.props.adAccount) {
      this.props.sendMessage('Missing required Ad Account!', true);
      return;
    }
    if (!this.props.page) {
      this.props.sendMessage('Missing required page!', true);
      return;
    }

    window.FB.ui({
      method: 'lead_gen',
      display: 'popup',
      page_id: this.props.page.id,
      ad_account_id: this.props.adAccount, // Note: This does NOT contain 'act_'
    }, (response)  => {
      // todo save page form to the campaign
      if (response) {
        this.setState({
          ...this.state,
          defaultForm: response.formID,
          pageForms: [...this.state.pageForms, { key: response.formID, text: response.name, value: {
              id: response.formID,
              name: response.name,
            }}],
        })
      }
    });
  };

  componentDidMount() {
    const { page } = this.props;
    const pageId = page.id;
    const pageAccessToken = page.access_token;
    window.FB.api(`/${pageId}/leadgen_forms`, { access_token: pageAccessToken }, ({ data, paging }) => {
      if (data && data.length) {
        const forms = data.map(form => ({ key: form.id, text: form.name, value: form }));
        this.setState({
          ...this.state,
          pageForms: forms,
        });
      }
    });
  }

  formSelected = (event, data) => {
    this.setState({
      ...this.state,
      pageForm: data.value
    })
  };

  onSubscribe = () => {
    if (!this.state.pageForm) {
      this.props.sendMessage('Missing required selected Form!', true);
      return;
    }

    this.props.onSubscribe(this.props.page, this.state.pageForm);
  };
  onUnsubscribe = (integrationId) => {
    if (!integrationId) {
      this.props.sendMessage('Missing required integration!', true);
      return;
    }

    this.props.onUnSubscribe(integrationId);
  };

  render() {
    const { page } = this.props;
    return (
      <Table.Row>
        <Table.Cell>{page.name}</Table.Cell>
        <Table.Cell>
          <Select placeholder='Select Form'
                  className='select-fb-form'
                  defaultValue={this.state.defaultForm}
                  loading={!this.state.pageForms}
                  options={this.state.pageForms || []}
                  onChange={this.formSelected}
          />
          <Button className='create-fb-form' onClick={this.createNewPageForm}>Create New Form</Button>
        </Table.Cell>
        <Table.Cell>
          <Button className='subscribe-fb-but' onClick={this.onSubscribe}>Subscribe</Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}

export default compose(MessagesContainer)(PageRow)