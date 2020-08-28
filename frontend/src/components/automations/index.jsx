import React, {Component} from 'react';
import {compose} from 'recompose';
import './index.scss';
import { Button, Grid, Header, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { SVG } from '@svgdotjs/svg.js'

import { AutomationFormContainer, DealActionsContainer } from "@containers";

import textIcon from './assets/text.png';
import emailIcon from './assets/email.png';
import statusChangeIcon from './assets/statuschange.png';
import whatsappIcon from './assets/whatsapp.png';
import settingIcon from './assets/settings.png';
import agentPushIcon from './assets/agentpush.png';
import addNew from './assets/addnew.png';
import AutomationModal from "../@common/modals/automation";
import {actionTypes, TYPE_SMS_MESSAGE} from "../../@containers/forms/automation/actionTypes";

const refSVGContainer = React.createRef();

class Campaigns extends Component {
  state = {
    isRoot: true,
    companyId: null,
    dealId: null
  };

  draw;
  addVerticalButtonContainer;
  addButtonVertical;
  addHorizontalButtonContainer;
  addButtonHorizontal;

  componentDidMount() {
    const {companyId, dealId} = this.props.match.params;
    this.setState({
      companyId,
      dealId,
    });

    this.props.fetchDealActions(dealId);

    this.draw = SVG().addTo(refSVGContainer.current).size('100%' , '100%');
    this.createButtonAddVerticalAction();


    // const createTriggerVertical = draw.circle(50).attr({ fill: '#ccc' });
    // const createTriggerHorizontal = draw.circle(50).attr({ fill: '#ccc' }).hide();
    let firstRootElement = null;

    // createTriggerVertical.click( () => {
    //   if (!firstRootElement) {
    //     createTriggerVertical.dy(100);
    //   }
    //   draw.circle(50).attr({ fill: '#444' }).dy(createTriggerVertical.y());
    //   createTriggerHorizontal.dx(100).show();
    // });
  }

  createButtonAddVerticalAction() {
    this.addVerticalButtonContainer = this.draw.nested().width(60).height(60);
    this.addButtonVertical = this.addVerticalButtonContainer.image(addNew, {cursor: 'pointer'}).dx(0).dy(0);

    this.addButtonVertical.on('mouseover', () => {
      this.addButtonVertical.dx(-62);
    });
    this.addButtonVertical.on('mouseout', () => {
      this.addButtonVertical.dx(62);
    });

    this.addButtonVertical.on('click', () => {
      this.props.loadForm({show: true, is_root: 1});
    });

    return this.addVerticalButtonContainer;
  }

  createButtonAddHorizontalAction() {
    this.addHorizontalButtonContainer = this.draw.nested().width(60).height(60);
    this.addButtonHorizontal = this.addHorizontalButtonContainer.image(addNew, {cursor: 'pointer'}).dx(0).dy(0);

    this.addButtonHorizontal.on('mouseover', () => {
      this.addButtonHorizontal.dx(-62);
    });
    this.addButtonHorizontal.on('mouseout', () => {
      this.addButtonHorizontal.dx(62);
    });

    this.addButtonHorizontal.on('click', () => {
      this.props.loadForm({ show: true, is_root: 1 });
    });

    return this.addHorizontalButtonContainer;
  }

  drawHorizontalLine() {
    this.draw.circle(10, { fill: '#ccc' }).dy(25).dx(70);
    const line = this.draw.line(0, 0, 165, 0).move(75, 30)
    line.stroke({ color: '#ccc', width: 2, linecap: 'round' });
  }

  drawVerticalLine() {
    this.draw.circle(10, { fill: '#ccc' }).dy(70).dx(25);
    const line = this.draw.line(0, 0, 0, 165).move(30, 75)
    line.stroke({ color: '#ccc', width: 2, linecap: 'round' });
  }

  componentDidUpdate(prevState) {
    console.log(this.props.actions);

    if (prevState.actions.length !== this.props.actions.length) {
      this.drawSvg();
      console.log('prevProps.actions=', prevState.actions, this.props.actions);
    }
  }

  drawSvg() {
    this.draw.clear();
    this.props.actions.forEach(action => {
      switch (action.type) {
        case TYPE_SMS_MESSAGE: {
          console.log(action);
          if (action.is_root && !action.parent_id) {
            this.draw.image(textIcon);
            this.drawHorizontalLine();
            this.drawVerticalLine();
            this.createButtonAddVerticalAction().dy(240);
            this.createButtonAddHorizontalAction().dx(240);
          } else if(action.is_root) {
            this.draw.image(textIcon).dy(60);
          } else {
            this.draw.image(textIcon).dx(120);
          }
        }
        default:
      }
      console.log(action);
    });
  }

  render() {
    const { dealId } = this.state;

    return (
      <div className='Automations'>
        <AutomationModal dealId={dealId} />
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

export default compose(AutomationFormContainer, DealActionsContainer)(Campaigns);
