import React, {Component} from 'react';

import {
    Form,
    Input,
    Segment,
    Button,
    Grid,
    Select,
} from 'semantic-ui-react';
import './index.scss';

class AgentForm extends Component {

    render() {
        return (<Form size='big' className='textMessage' autocomplete='off'>
            Automation form
        </Form>)
    }
}

export default AgentForm;
