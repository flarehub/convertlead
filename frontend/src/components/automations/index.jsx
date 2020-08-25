import React, {Component} from 'react';
import {compose} from 'recompose';
import './index.scss';
import { Button, Grid, Header, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { SVG } from '@svgdotjs/svg.js'

import {AutomationFormContainer} from "@containers";

import textIcon from './assets/text.png';
import emailIcon from './assets/email.png';
import statusChangeIcon from './assets/statuschange.png';
import whatsappIcon from './assets/whatsapp.png';
import settingIcon from './assets/settings.png';
import agentPushIcon from './assets/agentpush.png';
import AutomationModal from "../@common/modals/automation";

const refSVGContainer = React.createRef();

class Campaigns extends Component {
  state = {
    companyId: null,
    dealId: null
  };

  componentDidMount() {
    this.props.loadForm({ show: true });

    const {companyId, dealId} = this.props.match.params;
    this.setState({
      companyId,
      dealId,
    });

    const draw = SVG().addTo(refSVGContainer.current).size('100%' , '100%');
    draw.image(textIcon, { cursor: 'pointer' }).dx(20).dy(20);

    const createTriggerVertical = draw.circle(50).attr({ fill: '#ccc' });
    const createTriggerHorizontal = draw.circle(50).attr({ fill: '#ccc' }).hide();
    let firstRootElement = null;

    createTriggerVertical.click( () => {
      if (!firstRootElement) {
        createTriggerVertical.dy(100);
      }
      draw.circle(50).attr({ fill: '#444' }).dy(createTriggerVertical.y());
      createTriggerHorizontal.dx(100).show();
    });
  }

  render() {
    const { dealId } = this.state;

    return (
      <div className='Automations'>
        <AutomationModal />
        <Grid columns={2}>
          <Grid.Column>
            <Header floated='left' as='h1'>Automations</Header>
          </Grid.Column>
          <Grid.Column>
            <Menu secondary>
              <Menu.Menu position='right'>
                <Link to={`/deals/${dealId}/integrations`} >
                  <Button color='teal' content='Integrations' labelPosition='left'/>
                </Link>
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
        <div ref={refSVGContainer} className="automation-container">
          &nbsp;
        </div>
      </div>
    );
  }
}

export default compose(AutomationFormContainer)(Campaigns);
