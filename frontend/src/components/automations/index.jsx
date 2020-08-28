import React, {Component} from 'react';
import {compose} from 'recompose';
import './index.scss';
import { Button, Grid, Header, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { SVG } from '@svgdotjs/svg.js'
import * as R from 'ramda';

import { AutomationFormContainer, DealActionsContainer } from "@containers";

import textIcon from './assets/text.png';
import emailIcon from './assets/email.png';
import statusChangeIcon from './assets/statuschange.png';
import whatsappIcon from './assets/whatsapp.png';
import blindCall from './assets/blindcall.png';
import settingIcon from './assets/settings.png';
import agentPushIcon from './assets/agentpush.png';
import addNew from './assets/addnew.png';
import AutomationModal from "../@common/modals/automation";
import {
  TYPE_BLIND_CALL,
  TYPE_EMAIL_MESSAGE,
  TYPE_LEAD_CHANGE_STATUS, TYPE_PUSH_NOTIFICATION,
  TYPE_SMS_MESSAGE
} from "../../@containers/forms/automation/actionTypes";

const refSVGContainer = React.createRef();

class Campaigns extends Component {
  state = {
    isRoot: true,
    scale: 1,
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
    this.draw = this.draw.group();
    this.drawSvg();
  }

  createButtonAddVerticalAction(parent) {
    const addVerticalButtonContainer = this.draw.nested().width(60).height(60);
    const addButtonVertical = addVerticalButtonContainer.image(addNew, {cursor: 'pointer'}).dx(0).dy(0);

    addButtonVertical.on('mouseover', () => {
      addButtonVertical.dx(-62);
    });
    addButtonVertical.on('mouseout', () => {
      addButtonVertical.dx(62);
    });

    addButtonVertical.on('click', () => {
      this.props.loadForm({show: true, is_root: 1, id: null, object: null, parent_id: R.pathOr(null, ['id'], parent) });
    });

    return addVerticalButtonContainer;
  }

  createButtonAddHorizontalAction(parent) {
    const addHorizontalButtonContainer = this.draw.nested().width(60).height(60);
    const addButtonHorizontal = addHorizontalButtonContainer.image(addNew, {cursor: 'pointer' }).dx(0).dy(0);

    addButtonHorizontal.on('mouseover', () => {
      addButtonHorizontal.dx(-62);
    });
    addButtonHorizontal.on('mouseout', () => {
      addButtonHorizontal.dx(62);
    });

    addButtonHorizontal.on('click', () => {
      this.props.loadForm({ show: true, is_root: 0, id: null, object: null, parent_id: parent.id });
    });

    return addHorizontalButtonContainer;
  }

  drawHorizontalLine(draw) {
    draw.circle(10, { fill: '#ccc' }).dy(25).dx(70);
    const line = draw.line(0, 0, 165, 0).move(75, 30)
    line.stroke({ color: '#ccc', width: 2, linecap: 'round' });
  }

  drawVerticalLine(draw) {
    draw.circle(10, { fill: '#ccc' }).dy(70).dx(25);
    const line = draw.line(0, 0, 0, 165).move(30, 75)
    line.stroke({ color: '#ccc', width: 2, linecap: 'round' });
  }

  componentDidUpdate(prevState) {
    if (prevState.actionsOriginal.length !== this.props.actionsOriginal.length) {
      this.drawSvg();
    }
  }

  drawSvg() {
    this.draw.clear();
    this.props.actions.forEach(action => {
      this.drawAction(action).dy(action.index * 240);

      if (action.children) {
        this.drawHorizontalActions(action.children, action);
      }
      if (action.children) {
        const lastAction = R.last(action.children);
        this.createButtonAddHorizontalAction(lastAction).dx((lastAction.index + 1) * 240).dy(action.index * 240);
      } else if (action.is_root) {
        this.createButtonAddHorizontalAction(action).dy((action.index) * 240).dx(240);
      }
    });

    const lastAction = R.last(this.props.actions);
    const index = (R.path(['index'], lastAction) !== undefined ? R.path(['index'], lastAction) + 1 : 0);
    this.createButtonAddVerticalAction(lastAction).move(0, index * 240);
  }

  drawHorizontalActions(horizontalActions, parent) {
      horizontalActions.forEach(action => {
        this.drawAction(action).dx(action.index * 240).dy((parent.index * 240));
      });
  }

  drawAction(action) {
    const group = this.draw.nested();
    switch (action.type) {
      case TYPE_SMS_MESSAGE: {
        this.drawIcon(group, textIcon, action)
        break;
      }
      case TYPE_EMAIL_MESSAGE: {
        this.drawIcon(group, emailIcon, action);
        break;
      }
      case TYPE_LEAD_CHANGE_STATUS: {
        this.drawIcon(group, statusChangeIcon, action);
        break;
      }
      case TYPE_BLIND_CALL: {
        this.drawIcon(group, blindCall, action)
        break;
      }
      case TYPE_PUSH_NOTIFICATION: {
        this.drawIcon(group, agentPushIcon, action);
      }
      default:
    }

    this.drawHorizontalLine(group);
    if (action.is_root) {
      this.drawVerticalLine(group);
    }

    return group;
  }

  drawIcon(group, icon, action) {
    const iconButton = group.image(icon, { kid: action.id, cursor: 'pointer' });
    iconButton.on('click', () => {
      const action = this.props.getActionBy(iconButton.attr('kid'));
      console.log(action);
      this.props.loadForm({ show: true, ...action });
    });
  }

  scaleUp = () => {
    console.log(this.state);
    const scale = this.state.scale + 0.1;
    this.setState({
      ...this.state,
      scale,
    })
    this.draw.attr({
      transform: `matrix(${scale},0,0,${scale}, 0, 0)`
    });
  }

  scaleDown = () => {
    const scale = this.state.scale - 0.1;
    this.setState({
      ...this.state,
      scale,
    })
    this.draw.attr({
      transform: `matrix(${scale},0,0,${scale}, 0, 0)`
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
            <div className="buttonsToScale">
              <Button color="teal" content='Scale Up' onClick={this.scaleUp} labelPosition='left'/>
              <Button color="teal" content='Scale Down' onClick={this.scaleDown} labelPosition='left'/>
            </div>
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
