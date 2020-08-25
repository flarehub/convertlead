import React, {Component} from 'react';

import {
    Form,
    Input,
    Segment,
    Button,
    TextArea,
    Grid,
    Select, Checkbox,
} from 'semantic-ui-react';
import './index.scss';
import {checkTypeIsDays, delayTypes} from "@containers/forms/automation/delayTypes";
import {actionTypes} from "@containers/forms/automation/actionTypes";
import {DELAY_TYPE_TIME} from "@containers/forms/automation/delayTypes";
import JoditEditor from "jodit-react";
import {
    checkIsTypeEmail,
    checkIsTypeText,
    checkIsTypePushNotification,
    TYPE_SMS_MESSAGE
} from "@containers/forms/automation/actionTypes";
import {checkIsTypeStatusChange} from "@containers/forms/automation/actionTypes";

const editor = React.createRef();
const config = {
    readonly: false,
};

class AgentForm extends Component {

    state = {
        content: '',
    }

    onChange = (event, data) => {
        this.props.changeForm({[data.name]: data.value});
    };

    onChangeLeadStatus = (event, data) => {
        this.props.changeForm({ object: {
             status: data.value,
        }});
    };

    onChangeTimeHours = (event) => {
        const hours = event.target.value;
        this.props.changeForm({ delay_hours: hours });
    };

    onChangeTimeMinutes = (event) => {
        const minutes = event.target.value;
        this.props.changeForm({ delay_minutes: minutes });
    };

    onChangeDays = (event) => {
        const days = event.target.value;
        this.props.changeForm({ delay_days: days });
    };

    onChangeEmailMessage = (message) => {
        this.props.changeForm({ object: { message } });
    };

    onTextMessageChange = (message) => {
        this.props.changeForm({ object: { message } });
    };

    render() {
        const { type = TYPE_SMS_MESSAGE, delay_type, stop_on_manual_contact } = this.props.form;
        const { selectBoxStatuses } = this.props;
        const { content } = this.state;

        return (<Form size='big' className='textMessage' autocomplete='off'>
            <Grid columns={1} relaxed='very' stackable>
                <Grid.Column>
                    <Form.Field required>
                        <label>Action type</label>
                        <Select placeholder='Select action type'
                                name='type'
                                options={actionTypes}
                                defaultValue={type || TYPE_SMS_MESSAGE}
                                onChange={this.onChange} />
                    </Form.Field>
                    <Form.Field required>
                        <label>Delay</label>
                        <div className="times">
                            {
                                checkTypeIsDays(delay_type) && <div className="days">
                                    <Input placeholder="0" min="0" step="1" type="number" onChange={this.onChangeDays}/>
                                </div>
                            }
                            {
                                !checkTypeIsDays(delay_type) && <>
                                    <div className="hours">
                                        <Input placeholder="HH" min="0" step="1" type="number" onChange={this.onChangeTimeHours}/>
                                    </div>
                                    <div className="minutes">
                                        <Input placeholder="mm" min="0" step="1" type="number" onChange={this.onChangeTimeMinutes}/>
                                    </div>
                                </>
                            }
                            <div className="selectDelay">
                                <Select placeholder="Select delay"
                                        name="delay_type"
                                        options={delayTypes}
                                        defaultValue={delay_type || DELAY_TYPE_TIME}
                                        onChange={this.onChange} />
                            </div>
                        </div>
                    </Form.Field>
                    {
                        (
                          checkIsTypeText(type) ||
                          checkIsTypePushNotification(type)
                        ) && (
                          <Form.Field required>
                              <TextArea onChange={this.onTextMessageChange} />
                          </Form.Field>
                        )
                    }
                    {
                        checkIsTypeEmail(type) && (
                          <Form.Field required>
                              <JoditEditor
                                ref={editor}
                                value={content}
                                config={config}
                                tabIndex={1}
                                onBlur={this.onChangeEmailMessage}
                                onChange={this.onChangeEmailMessage}
                              />
                          </Form.Field>
                        )
                    }
                    {
                        checkIsTypeStatusChange(type) && (
                          <Form.Field required>
                              <Select placeholder="Select delay"
                                      name="delay_type"
                                      options={selectBoxStatuses}
                                      defaultValue={delay_type || DELAY_TYPE_TIME}
                                      onChange={this.onChangeLeadStatus} />
                          </Form.Field>
                        )
                    }
                    <Form.Field>
                        <Checkbox
                          label="Stop on manual contact"
                          name="stop_on_manual_contact"
                          checked={stop_on_manual_contact}
                          toggle
                          onChange={this.onChange}
                        />
                    </Form.Field>
                </Grid.Column>
            </Grid>
        </Form>)
    }
}

export default AgentForm;
