import { compose } from 'recompose';
import React, { Component } from 'react'
import { Button, Modal, Radio, Icon, Table, Select } from 'semantic-ui-react'
import {MessagesContainer} from "@containers";
import * as R from 'ramda';

import './index.scss';
import PageRow from "./PageRow";

class FacebookIntegrationModal extends Component {
  state = {
    open: false,
    copied: false,
    pageForms: {},
    page: {},
    adAccount: null,
  };

  onSelectAdAccount = (event, data) => {
    this.setState({
      ...this.state,
      adAccount: data.value,
    });
  };

  onSubscribe = (page, form, adAccount = null) => {
    window.FB.api(
      `/${page.id}/subscribed_apps`, 'post', {
        access_token: page.access_token,
        subscribed_fields: 'leadgen',
      }, (response) => {
        if (!response.success) {
          this.props.sendMessage('Was not possible to subscribe!', true);
          return;
        }
        this.props.sendMessage(`Subscribed to '${page.name}'!`);
        // todo save integration to server
        this.props.subscribe(this.props.campaign.id, {
          deal_campaign_id: +this.props.campaign.id,
          page_name: page.name,
          form_name: form.name,
          fb_page_id: +page.id,
          fb_form_id: +form.id,
          fb_page_access_token: page.access_token,
          fb_ad_account_id: adAccount,
        });
      });
  };

  onUnSubscribe = (integrationId) => {
    console.log('unsubscribe', integrationId);
    this.props.unsubscribe(this.props.campaign.id, integrationId);
  };

  render() {
    let { fbPages = [], fbAdAccounts=[], fbIntegrations = [] } = this.props;
    return (
      <Modal className='ApiIntegration' open={this.props.open} onClose={this.props.onClose}>
        <Modal.Header>Facebook API Integration</Modal.Header>
        <Modal.Content>
          { (!fbPages.length ? 'Missing Active pages!' : '') }
          {
            fbAdAccounts.length ? <div className="ads_accounts">
              <label>Ads Accounts</label>
              <Select placeholder='Select Ads account'
                      required={true}
                      loading={!fbAdAccounts}
                      options={fbAdAccounts || []}
                      onChange={this.onSelectAdAccount}
              />
            </div> : null
          }
          <Table celled compact definition>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.HeaderCell>Page Name</Table.HeaderCell>
                <Table.HeaderCell>Form Name</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                fbPages && fbPages.map((page, key) => <PageRow key={key}
                                                    page={page}
                                                    adAccount={this.state.adAccount}
                                                    onSubscribe={this.onSubscribe}
                />)
              }
              {
                fbIntegrations && fbIntegrations.map((integration, key) => <Table.Row key={`int-${key}`}>
                  <Table.Cell>{integration.page_name || integration.fb_page_id}</Table.Cell>
                  <Table.Cell>{integration.form_name || integration.fb_form_id}</Table.Cell>
                  <Table.Cell><Button onClick={this.onUnSubscribe.bind(this, integration.id)} >Unsubscribe</Button></Table.Cell>
                </Table.Row>)
              }
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={this.props.onClose}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default compose(MessagesContainer)(FacebookIntegrationModal);